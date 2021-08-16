const USERNAME = 'root'
const PASSWORD = 'root'
const DATABASE = 'genlicense'
const ADMIN_EMP_ID = '42001'

var db = connect('127.0.0.1:27017/genlicense');

db.permission.insert({'emp_id': ADMIN_EMP_ID, 'page': 'menu_settings'});
db.createUser({'user': USERNAME, 'pwd': PASSWORD, 'roles': [{ 'role': 'readWrite', 'db': DATABASE}]});