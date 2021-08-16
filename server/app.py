from bson.objectid import ObjectId
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import pymongo
from pymongo import errors
import mysql.connector
from mysql.connector import Error
import json
from bson import json_util
from datetime import datetime

from config import *

app = Flask(__name__)

CORS(app)

myclient = pymongo.MongoClient(MONGO_CONNECTION_URI)
mydb = myclient["genlicense"]

connection = mysql.connector.connect( host=MYSQL_CONNECTION_HOST, port=MYSQL_CONNECTION_PORT,
                                      user=MYSQL_CONNECTION_USER, password=MYSQL_CONNECTION_PASSWORD,
                                      database=MYSQL_CONNECTION_DATABASE )

@app.route('/site/read', methods=['GET'])
def site_read():
    mycol = mydb["site"]
    data = {"site":None}
    array = []
    try:
        for d in mycol.find().sort("site_name"):
            array.append(d)
        data["site"] = array
        return json.loads(json_util.dumps(data))
    except errors.PyMongoError as e:
        return Response(str(e), status=400)

@app.route('/site/write', methods=['POST'])
def site_write():
    data = request.get_json()
    mycol = mydb["site"]

    try:
        res = mycol.update_one({"site_id":data["site_id"]}, {'$set':data}, True)
        data = site_read()
        return json.loads(json_util.dumps(data))
    except errors.PyMongoError as e:
        return Response(str(e), status=400)

@app.route('/site/edit', methods=['POST'])
def site_edit():
    data = request.get_json()
    site_col = mydb["site"]

    try:

        site_data = site_col.find_one({"_id":ObjectId(data["key"])})
        
        if site_data["site_id"] == data["value"]["site_id"]:
            print("do not change other collections")
        else:
            print("change other collections")
            site_module_col = mydb["site_module"]
            site_module_col.update_many({"site_id":site_data["site_id"]}, {"$set":{
                "site_id":data["value"]["site_id"]
            }})
            file_col = mydb["generate_file"]
            file_col.update_many({"site_id":site_data["site_id"]}, {"$set":{
                "site_id":data["value"]["site_id"]
            }})

        site_col.update_one({"_id":ObjectId(data["key"])}, {'$set':data["value"]})

        data = site_read()
        return json.loads(json_util.dumps(data))
    
    except errors.PyMongoError as e:

        return Response(str(e), status=400)

@app.route('/site/find', methods=['POST'])
def site_find():
    myquery = request.get_json()
    mycol = mydb["site"]
    data = {"site":None}
    array = []
    try:
        for d in mycol.find(myquery):
            array.append(d)
        data["site"] = array
        return json.loads(json_util.dumps(data))
    except errors.PyMongoError as e:
        return Response(str(e), status=400)

@app.route('/site/delete', methods=['POST'])
def site_delete():
    myquery = request.get_json()
    site_col = mydb["site"]
    site_module_col = mydb["site_module"]
    file_col = mydb["generate_file"]

    try:
        site_module_col.delete_many({"site_id":myquery["site_id"]})
        file_col.delete_many({"site_id":myquery["site_id"]})
        site_col.delete_one(myquery)

        data = site_read()
        return json.loads(json_util.dumps(data))

    except errors.PyMongoError as e:
        return Response(str(e), status=400)        

@app.route('/module/read', methods=['GET'])
def module_read():
    mycol = mydb["module"]
    data = {"module":None}
    array = []
    try:
        for d in mycol.find().sort("module_name"):
            array.append(d)
        data["module"] = array
        return json.loads(json_util.dumps(data))
    except:
        data = {"error":"Cannot read data!"}
        return json.loads(json_util.dumps(data))

@app.route('/module/write', methods=['POST'])
def module_write():
    data = request.get_json()
    mycol = mydb["module"]

    try:
        mycol.update_one({"module_id":data["module_id"]}, {'$set':data}, True)

        data = module_read()
        return json.loads(json_util.dumps(data))
    except errors.PyMongoError as e:
        return Response(str(e), status=400)

@app.route('/module/edit', methods=['POST'])
def module_edit():
    data = request.get_json()
    module_col = mydb["module"]

    try:

        module_data = module_col.find_one({"_id":ObjectId(data["key"])})

        if module_data["module_id"] == data["value"]["module_id"]:
            print("do not change other collections")
        else:
            print("change other collections")
            site_module_col = mydb["site_module"]
            site_module_col.update_many({"module_id":module_data["module_id"]}, {"$set":{
                "module_id":data["value"]["module_id"]
            }})
            file_col = mydb["generate_file"]
            file_col.update_many({"module_id":module_data["module_id"]}, {"$set":{
                "module_id":data["value"]["module_id"]
            }})

        module_col.update_one({"_id":ObjectId(data["key"])}, {'$set':data["value"]})

        data = module_read()
        return json.loads(json_util.dumps(data))
    
    except errors.PyMongoError as e:
        return Response(str(e), status=400)

@app.route('/module/find', methods=['POST'])
def module_find():
    myquery = request.get_json()
    mycol = mydb["module"]
    data = {"module":None}
    array = []
    try:
        for d in mycol.find(myquery):
            array.append(d)
        data["module"] = array
        return json.loads(json_util.dumps(data))
    except errors.PyMongoError as e:
        return Response(str(e), status=400)

@app.route('/module/delete', methods=['POST'])
def module_delete():
    myquery = request.get_json()
    module_col = mydb["module"]

    try:

        site_module_col = mydb["site_module"]
        site_module_col.delete_many({"module_id":myquery["module_id"]})
        file_col = mydb["generate_file"]
        file_col.delete_many({"module_id":myquery["module_id"]})

        module_col.delete_one(myquery)

        data = module_read()
        return json.loads(json_util.dumps(data))

    except errors.PyMongoError as e:
        return Response(str(e), status=400)

@app.route('/site-module/read', methods=['GET'])
def site_module_read():
    collection_site = mydb["site"]
    collection_site_module = mydb["site_module"]
    collection_module = mydb["module"]

    data = dict()
    site_list = list()
    try:
        sites = collection_site.find()
        for site in sites:
            site_data = dict()
            site_data["id"] = site.get('site_id', '')
            site_data["name"] = site.get('site_name', '')
            site_data["description"] = site.get('description', '')

            module_list = list()
            site_modules = collection_site_module.find({'site_id': site_data["id"]})
            for site_module in site_modules:
                site_module_module_id = site_module.get('module_id', '')
                module = collection_module.find_one({'module_id': site_module_module_id})
                module_data = dict()
                module_data["id"] = module.get('module_id', '')
                module_data["name"] = module.get('module_name', '')
                module_data["description"] = module.get('description', '') 
                module_list.append(module_data)

            module_list.sort(key=lambda s: s['name'])
            site_data["details"] = module_list
            site_list.append(site_data)
        
        site_list.sort(key=lambda s: s['name'])
        data["site-module"] = site_list

        return json.loads(json.dumps(data))
    except errors.PyMongoError as e:
        return Response(str(e), status=400)

@app.route('/site-module/write', methods=['POST'])
def site_module_write():
    data = request.get_json()
    mycol = mydb["site_module"]
    
    try:
        mycol.insert_one(data)

        data = site_module_read()
        return json.loads(json_util.dumps(data))
    except errors.PyMongoError as e:
        return Response(str(e), status=400)

@app.route('/site-module/find', methods=['POST'])
def site_module_find():
    myfilter = request.get_json()
    sitefilter = myfilter["sitefilter"]
    modulefilter = myfilter["modulefilter"]

    print(sitefilter,modulefilter)

    collection_site = mydb["site"]
    collection_site_module = mydb["site_module"]
    collection_module = mydb["module"]

    data = dict()
    site_list = list()

    try:
        sites = collection_site.find({'$or':[{"site_id":{'$regex': sitefilter, '$options':'i'}}, 
                                    {"site_name":{'$regex': sitefilter, '$options':'i'}}]})
        for site in sites:
            site_data = dict()
            site_data["id"] = site.get('site_id', '')
            site_data["name"] = site.get('site_name', '')
            site_data["description"] = site.get('description', '')

            module_list = list()
            site_modules = collection_site_module.find({'site_id': site_data["id"]})
            for site_module in site_modules:
                site_module_module_id = site_module.get('module_id', '')
                module = collection_module.find_one({'$and':[
                    {'module_id': site_module_module_id},
                    {'$or':[{"module_id":{'$regex': modulefilter, '$options':'i'}}, 
                            {"module_name":{'$regex': modulefilter, '$options':'i'}}]}
                ]})

                if module is not None:
                    module_data = dict()
                    module_data["id"] = module.get('module_id', '')
                    module_data["name"] = module.get('module_name', '')
                    module_data["description"] = module.get('description', '') 
                    module_list.append(module_data)

            module_list.sort(key=lambda s: s['name'])
            site_data["details"] = module_list
            site_list.append(site_data)
        
        site_list.sort(key=lambda s: s['name'])
        data["site-module"] = site_list

        return json.loads(json.dumps(data))
    except errors.PyMongoError as e:
        return Response(str(e), status=400)

@app.route('/site-module/delete', methods=['POST'])
def site_module_delete():
    myquery = request.get_json()

    try:
        mycol = mydb["site_module"]
        mycol.delete_one(myquery)

        mycol = mydb["generate_file"]
        mycol.delete_many(myquery)

        data = site_module_read()
        return json.loads(json_util.dumps(data))
    except errors.PyMongoError as e:
        return Response(str(e), status=400)

@app.route('/file/read', methods=['GET'])
def file_read():
    site_col = mydb["site"]
    module_col = mydb["module"]
    file_col = mydb["generate_file"]

    data = dict()

    try:
        site_list = list()
        sites = site_col.find().sort("site_name")
        for site in sites:
            site_data = dict()
            site_data["site_id"] = site.get('site_id','')
            site_data["site_name"] = site.get('site_name', '')
            
            env_list = list()
            environments = file_col.distinct("env_id",{"site_id":site_data["site_id"]})
            for env in environments:
                env_data = dict()
                env_data["env_id"] = env
                lic_file = file_col.find_one({"site_id": site_data["site_id"], "env_id": env_data["env_id"]})
                env_data["lic_name"] = lic_file.get('lic_name', '')
                
                module_list = list()
                modules = file_col.find({"site_id": site_data["site_id"], "env_id": env_data["env_id"]})
                for module in modules:
                    module_data = dict()
                    module_data["module_id"] = module.get('module_id', '')
                    module_details = module_col.find_one({"module_id": module_data["module_id"]})
                    module_data["module_name"] = module_details.get('module_name', '')
                    module_data["agent"] = module.get('license_agent', 0)
                    module_data["supervisor"] = module.get('license_supervisor', 0)
                    module_data["manager"] = module.get('license_manager', 0)
                    module_data["expired_date"] = module.get('license_expired_date', '')
                    if module_data["expired_date"] == 'Never':
                        module_data["expired_date"] = 'Never'
                    else:
                        module_data["expired_date"] = module_data["expired_date"].strftime("%Y-%m-%dT%H:%M:%S.%fZ")
                    module_list.append(module_data)
                
                env_data["details"] = module_list
                env_list.append(env_data)
            
            env_list.sort(key=lambda s: s['env_id'])
            site_data["environments"] = env_list
            site_list.append(site_data)
        
        data["file"] = site_list
        return json.loads(json_util.dumps(data))
    except errors.PyMongoError as e:
        return Response(str(e), status=400)

@app.route('/file/write', methods=['POST'])
def file_write():
    mycol = mydb["generate_file"]
    data = request.get_json()
    try:
        for d in data:
            if d["license_expired_date"]=='Never':
                d["license_expired_date"] = 'Never'
            else:
                d["license_expired_date"] = datetime.strptime(d["license_expired_date"], "%Y-%m-%dT%H:%M:%S.%fZ")
            myquery = {"site_id":d["site_id"], "env_id":d["env_id"], "module_id": d["module_id"]} 
            myupdate = {"$set": d}
            mycol.update_one(myquery, myupdate, True)
        data = file_read()
        return json.loads(json_util.dumps(data))
    except errors.PyMongoError as e:
        return Response(str(e), status=400)

@app.route('/file/delete', methods=['POST'])
def file_delete():
    mycol = mydb["generate_file"]
    myquery = request.get_json()

    try:
        mycol.delete_many(myquery)

        data = file_read()
        return json.loads(json_util.dumps(data))
    except errors.PyMongoError as e:
        return Response(str(e), status=400)

@app.route('/auth', methods=['POST'])
def auth():
    req = request.get_json()
    email = req["email"]

    try:
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM cta_employee1 WHERE cta_employee1.is_gen_license = 1 AND cta_employee1.email = "'+email+'"')
        user = cursor.fetchone()

        result = dict()
        result["user"] = user
    
        return result
    except Error as e:
        return Response(str(e), status=400)

@app.route('/user/read', methods=['GET'])
def user_read():
    try:
        cursor = connection.cursor()
        cursor.execute('SELECT emp_id, first_name, last_name, department_id, department_name FROM cta_employee1 JOIN cta_department USING (department_id) ORDER BY department_id, first_name, last_name')
        user = cursor.fetchall()

        result = dict()
        result["user"] = user
    
        return result
    except Error as e:
        return Response(str(e), status=400)

@app.route('/permission/read', methods=['GET'])
def permission_read():
    mycol = mydb["permission"]
    data = {"user":None}
    array = []
    try:
        for d in mycol.aggregate([
            { "$group": { "_id": "$page", "permission": { "$push": "$emp_id" } } }
        ]):
            array.append(d)
        data["user"] = array
        return json.loads(json_util.dumps(data))
    except errors.PyMongoError as e:
        return Response(str(e), status=400)

@app.route('/permission/write', methods=['POST'])
def permission_write():
    mycol = mydb["permission"]
    myquery = request.get_json()
    key = myquery["key"]
    
    try:

        delete = myquery["delete"]
        for d in delete:
            emp_id = d.get('emp_id', '')
            mycol.delete_one({'emp_id': emp_id, 'page': key})
    
        insert = myquery["insert"]
        for i in insert:
            emp_id = i.get('emp_id', '')
            mycol.insert_one({'emp_id': emp_id, 'page': key})

        data = permission_read()
        return json.loads(json_util.dumps(data))
    
    except errors.PyMongoError as e:
        return Response(str(e), status=400)

@app.route('/permission/find', methods=['POST'])
def permission_find():
    myquery = request.get_json()
    mycol = mydb["permission"]
    data = {"user":None}
    array = []
    try:
        for d in mycol.find(myquery):
            array.append(d)
        data["user"] = array
        return json.loads(json_util.dumps(data))
    except errors.PyMongoError as e:
        return Response(str(e), status=400)
    
if __name__ == '__main__':
    app.run(debug=True)