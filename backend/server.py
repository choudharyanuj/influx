from flask import Flask
from flask import request, make_response, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
import json, hashlib, os, jwt

app = Flask(__name__)
CORS(app)

app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Anuj@1996'
app.config['MYSQL_DB'] = 'car_rent'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
mysql = MySQL(app)

def md5_hash(string):
    hash = hashlib.md5()
    hash.update(string.encode('utf-8'))
    return hash.hexdigest()

def generate_salt():
    salt = os.urandom(16)
    return salt.hex()

#User signup
@app.route('/signup', methods=['POST'])
def signup():
    user_name = request.headers.get('user_name')
    email_id = request.headers.get('email_id')
    mobile = request.headers.get('mobile')
    password = request.headers.get('password')
    if request.method == 'POST':
        f = request.files['user_image']
        location = "static/img/" + f.filename
        f.save(location)
    flag = False
    salt = generate_salt()
    password_hash = md5_hash((password) + salt)
    cursor = mysql.connection.cursor()
    cursor.execute("""select * FROM users""")
    results = cursor.fetchall()
    for item in results:
        if str(email_id) == str(item["email_id"]):
            flag = True
            mysql.connection.commit()
            cursor.close()
    if flag == True:
        return json.dumps("User Already Exist")
    else:
        cursor.execute("""insert into users (user_name, email_id,mobile, password_salt, password_hash, user_image) VALUES (%s, %s, %s,%s,%s,%s)""", (user_name, email_id,mobile, salt, password_hash,location))
        mysql.connection.commit()
        cursor.close()
        return json.dumps("Registerd Successfully")

# For User Login 
@app.route('/login', methods=["POST"])
def login():
    email_id = request.json["email_id"]
    password = request.json["password"]
    flag = False
    cursor = mysql.connection.cursor()
    cursor.execute("""select * from users""")
    results = cursor.fetchall()
    mysql.connection.commit()
    cursor.close()
    for item in results:
        if str(email_id) == str(item["email_id"]) and str(item["password_hash"]) == str(md5_hash(password+item["password_salt"])):
            flag = True
            encoded_jwt = jwt.encode({"user_id":item["user_id"],"user_name":item["user_name"],"email_id":item["email_id"],"mobile":item["mobile"],"user_image":item["user_image"]}, 'secretkey', algorithm='HS256').decode("utf-8")
    if flag == True:
        return json.dumps(str(encoded_jwt))
    else:
        return json.dumps("Wrong Password")

#Adding Cars
@app.route('/addcar',methods=['POST'])
def addcar():
    car_name = request.headers.get('car_name')
    car_no = request.headers.get('car_no')
    car_type = request.headers.get('car_type')
    car_color = request.headers.get('car_color')
    no_of_seats = request.headers.get('no_of_seats')
    if request.method == 'POST':
        f = request.files['car_image']
        location = "static/img/" + f.filename
        f.save(location)
    cursor = mysql.connection.cursor()
    cursor.execute(""" INSERT INTO allcars(car_name, car_no, car_type, car_color,no_of_seats, car_image) values (%s,%s,%s,%s,%s,%s)""",[car_name,car_no,car_type,car_color,no_of_seats,location])
    mysql.connection.commit()
    cursor.close()
    return json.dumps("Registerd Successfully")

# Showing all cars on home Page
@app.route('/home', methods=['POST'])
def home():
    page = request.args.get("page", default = 1, type = int)
    return json.dumps(pagination(page))

#Pagination for home page
def pagination(page):
    cursor = mysql.connection.cursor()
    cursor.execute("""select * from allcars""")
    results = cursor.fetchall()
    cursor.close()
    items = []
    for item in results:
        items.append(item)
    total_pages = len(items)//5+1
    total_users = len(items)
    return {
        "total_pages": total_pages,
        "total_users": total_users,
        "page": page,
        "data": items[(page*5)-5: page*5],
        "per_page": 5
        }

@app.route('/search')
def search():
    car_name = request.headers.get('car_name')
    cursor = mysql.connection.cursor()
    search_string = f"%{car_name}%"
    cursor.execute("""select * from allcars where car_name like (%s)""", [search_string])
    result = cursor.fetchall()
    mysql.connection.commit()
    cursor.close()
    return json.dumps(result)

# Details of a particular cars
@app.route('/details')
def details():
    car_id = request.headers.get('car_id')
    cursor = mysql.connection.cursor()
    cursor.execute("""select * from allcars where car_id = (%s)""",[car_id])
    result = cursor.fetchall()
    cursor.close()
    items = []
    for item in result:
        items.append(item)
    return json.dumps(items)        

#Accessing Token
@app.route('/gettoken')
def gettoken():
    auth_header = request.headers.get('Authorization')
    token_encoded = auth_header.split(' ')[1]
    decode_data = jwt.decode(token_encoded, 'secretkey', algorithms=['HS256'])
    return json.dumps(decode_data)

#For booking
@app.route('/booking',methods=['POST'])
def booking():
    car_id = request.headers.get('car_id')
    user_id = request.headers.get('user_id')
    car_name = request.headers.get('car_name')
    car_no = request.headers.get('car_no')
    car_type = request.headers.get('car_type')
    car_color = request.headers.get('car_color')
    cursor = mysql.connection.cursor()
    cursor.execute("""insert into bookings(car_id, user_id,car_name,car_no,car_type,car_color) values(%s,%s,%s,%s,%s,%s)""",[car_id,user_id,car_name,car_no,car_type,car_color])
    mysql.connection.commit()
    cursor.close()
    return json.dumps("Booking Successfully")

@app.route('/showbooking',methods=['POST'])
def showbooking():
    user_id = request.headers.get('user_id')
    cursor = mysql.connection.cursor()
    cursor.execute("""select * from bookings where user_id  = (%s)""", [user_id])
    result = cursor.fetchall()
    cursor.close()
    data = []
    for i in result:
        data.append(i)
    return json.dumps(data)

if __name__ == "__main__":
    app.run(debug = True)