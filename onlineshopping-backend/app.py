from flask import Flask, request, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# PostgreSQL connection URI
POSTGRES_URI = "postgresql://e_commerce_n8fz_user:DLy8Ln4Fm8tVfPzXIOz2UPKNJvb9m5L3@dpg-csclp8rqf0us73eoi8s0-a.oregon-postgres.render.com/e_commerce_n8fz"

# Function to get a database connection
def get_db_connection():
    conn = psycopg2.connect(POSTGRES_URI)
    return conn

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
        conn = get_db_connection()
        cur = conn.cursor()

        # Check if the user with the same email already exists
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cur.fetchone()

        if user:
            return jsonify({'error': 'Email already exists'}), 409  # Conflict status

        # Insert new user into the database
        cur.execute(
            "INSERT INTO users (name, email, username, password, phone_number, address) VALUES (%s, %s, %s, %s, %s, %s)",
            (name, email, username, password, phone_number, address)
        )
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'message': 'User created successfully!'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/signin', methods=['POST'])
def signin():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Check if the user exists and if the password matches
        cur.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))
        user = cur.fetchone()

        if user:
            return jsonify({'message': 'Sign in successful', 'user': {'id': user[0], 'name': user[4], 'email': user[2]}}), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401  # Unauthorized

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Fetch the user data by user_id
        cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user = cur.fetchone()

        if user:
            return jsonify({
                'id': user[0],
                'name': user[4],
                'email': user[2],
                'username': user[1],
                'phone_number': user[5],
                'address': user[6]
            }), 200
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
        conn = get_db_connection()
        cur = conn.cursor()

        # Update user information
        cur.execute(
            """UPDATE users 
               SET name = %s, username = %s, password = %s, phone_number = %s, address = %s 
               WHERE id = %s""",
            (name, username, password, phone_number, address, user_id)
        )
        conn.commit()
        cur.close()
        conn.close()

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
        conn = get_db_connection()
        cur = conn.cursor()

        # Insert a new cart entry and get the cart ID
        cur.execute("INSERT INTO cart (user_id, total_amount) VALUES (%s, %s) RETURNING cart_id", (user_id, total_price))
        cart_id = cur.fetchone()[0]

        # Insert each item into the cart_items table
        for item in items:
            product_id = item['id']
            quantity = item['quantity']
            cur.execute("INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (%s, %s, %s)",
                        (cart_id, product_id, quantity))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({'message': 'Checkout successful!'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/cart-history/<int:user_id>', methods=['GET'])
def get_cart_history(user_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

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
                cart_no, user_id, created_at, total_amount, product_id, quantity = cart

                cart_entry = next((item for item in result if item['cart_no'] == cart_no), None)
                if cart_entry:
                    cart_entry['products'].append({
                        'id': product_id,
                        'quantity': quantity
                    })
                else:
                    result.append({
                        'cart_no': cart_no,
                        'user_id': user_id,
                        'created_at': created_at,
                        'total_amount': total_amount,
                        'products': [{
                            'id': product_id,
                            'quantity': quantity
                        }] if product_id else []
                    })

            return jsonify(result), 200
        else:
            return jsonify({'error': 'No cart history found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
