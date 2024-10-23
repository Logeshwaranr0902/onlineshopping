from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS  

app = Flask(__name__)
CORS(app)  


app.config['MYSQL_HOST'] = ''
app.config['MYSQL_USER'] = ''  
app.config['MYSQL_PASSWORD'] = '' 
app.config['MYSQL_DB'] = '' 
mysql = MySQL(app)

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    phone_number = data.get('phone_number')
    address = data.get('address')

    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        
        if user:
            return jsonify({'error': 'Email already exists'}), 409  # Conflict status
        cur.execute("INSERT INTO users (name, email, username, password, phone_number, address) VALUES (%s, %s, %s, %s, %s, %s)",
                    (name, email, username, password, phone_number, address))
        mysql.connection.commit()
        cur.close()
        return jsonify({'message': 'User created successfully!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/signin', methods=['POST'])
def signin():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))
        user = cur.fetchone()

        if user:
            # User is found and authenticated
            return jsonify({'message': 'Sign in successful', 'user': {'id': user[0], 'name': user[4], 'email': user[2]}}), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401  # Unauthorized
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user = cur.fetchone()
        
        if user:
            return jsonify({'id': user[0], 'name': user[4], 'email': user[2], 'username': user[1], 'phone_number': user[5], 'address': user[6]}), 200
        else:
            return jsonify({'error': 'User not found'}), 404  # Not found
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/update/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json
    name = data.get('name')
    username = data.get('username')
    password = data.get('password')
    phone_number = data.get('phone_number')
    address = data.get('address')

    try:
        cur = mysql.connection.cursor()
        cur.execute(
            """UPDATE users 
               SET name = %s, username = %s, password = %s, phone_number = %s, address = %s 
               WHERE id = %s""",
            (name, username, password, phone_number, address, user_id)
        )
        mysql.connection.commit()
        cur.close()
        
        return jsonify({'message': 'User information updated successfully!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/checkout', methods=['POST'])
def checkout():
    data = request.json
    user_id = data.get('userId')
    items = data.get('items')
    total_price = data.get('totalPrice')
    

    try:
        # Step 1: Create a new cart entry
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO cart (user_id,total_amount) VALUES (%s, %s)", (user_id,total_price))
        mysql.connection.commit()

        # Step 2: Get the newly created cart ID
        cart_id = cur.lastrowid

        # Step 3: Insert each item into the cart_items table
        for item in items:
            product_id = item['id']  # Use dictionary key to access id
            quantity = item['quantity']
            cur.execute("INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (%s, %s, %s)",
                        (cart_id, product_id, quantity))

        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Checkout successful!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/cart-history/<int:user_id>', methods=['GET'])
def get_cart_history(user_id):
    try:
        cur = mysql.connection.cursor()
        # Query to fetch cart details along with associated products
        cur.execute("""
            SELECT c.cart_id, c.user_id, c.created_at, c.total_amount, ci.product_id, ci.quantity
            FROM cart AS c
            LEFT JOIN cart_items AS ci ON c.cart_id = ci.cart_id
            WHERE c.user_id = %s
        """, (user_id,))
        
        cart_history = cur.fetchall()

        if cart_history:
            result = []
            for cart in cart_history:
                # Unpack cart details
                cart_no, user_id, created_at, total_amount, product_id, quantity = cart
                
                # Check if the cart is already in the result
                cart_entry = next((item for item in result if item['cart_no'] == cart_no), None)
                if cart_entry:
                    # If the cart already exists, append the new product
                    cart_entry['products'].append({
                        'id': product_id,
                        'quantity': quantity
                    })
                else:
                    # If it's a new cart, create a new entry
                    result.append({
                        'cart_no': cart_no,
                        'user_id': user_id,
                        'created_at': created_at,
                        'total_amount': total_amount,
                        'products': [{
                            'id': product_id,
                            'quantity': quantity
                        }] if product_id else []  # Initialize with an empty product list if no products
                    })

            return jsonify(result), 200
        else:
            return jsonify({'error': 'No cart history found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
