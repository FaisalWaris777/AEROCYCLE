from email.utils import collapse_rfc2231_value
from flask import Flask, request, Response
from flask import jsonify
from flask_cors import CORS, cross_origin
import pickle
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from flask import send_file
import seaborn as sns
import jwt
from bson.json_util import dumps
from sklearn import linear_model
from sklearn import svm
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import accuracy_score, r2_score
from sklearn.model_selection import train_test_split
from sklearn.compose import make_column_transformer
from sklearn.pipeline import make_pipeline
import json
from flask_bcrypt import Bcrypt
from pymongo.mongo_client import MongoClient
uri = ""
# Create a new client and connect to the server
client = MongoClient(uri)

app = Flask(__name__)
CORS(app)
cors = CORS(app, resources={
    r"/*": {
        "origins": "http://localhost:3000"
    }
})
bcrypt = Bcrypt(app)

# Dataset/Mongodb
t = pd.read_excel('aircraft_parts_data.xlsx')

# Airlines/Manufact
Database = client.get_database('test')
table = Database.SampleTable


@app.route("/signup", methods=["POST"])
def Signup():
    data = request.json
    print(data)
    user = table.find_one({"email": data["Data"]["email"]})
    if user:
        return jsonify({"success": False, "message": "User already exists"})
    else:
        hashed_password = bcrypt.generate_password_hash(
            data["Data"]["password"]).decode('utf-8')
        query = table.insert_one({
            "email": data["Data"]["email"],
            "password": hashed_password
        })
        return jsonify({"success": True, "message": "hello"})


@app.route("/login", methods=["POST"])
def Login():
    data = request.json
    user = table.find_one({"email": data["email"]})
    
    if user:
        if bcrypt.check_password_hash(user["password"], data["password"]):
            token = jwt.encode(
                {"user_id": user["email"]},
                "secretwkwkw",
                algorithm="HS256"
            )

            return jsonify({"success": True, "token": token})
        else:
            return jsonify({"success": False, "message": "invalid password"})
    else:
        return jsonify({"success": False, "message": "User does not exist"})


@app.route("/material_comp", methods=["GET", "POST"])
def material_comp():
    if request.method == "POST":
        request_data = request.get_json()
        column_name = request_data['column_name']  # part name
        result = t[column_name].value_counts().reset_index()
        result.columns = ['column_1', 'column_2']
        result_1 = result['column_1'].values.tolist()
        result_2 = result['column_2'].values.tolist()
        column_name = 'Make'
        return (jsonify(result_1, result_2))  # sending to front end
    else:
        return ("Hello")

@app.route("/add_data", methods=["POST"])
def add_data():
    if request.method == "POST":
        # data = request.json
        # data to mongo database
        return jsonify("Success")


@app.route("/univariate", methods=["GET", "POST"])
def univariate():
    if request.method == "POST":
        request_data = request.get_json()
        column_name = request_data['column_name']  # condition
        result = t[column_name].value_counts().reset_index()
        result.columns = ['column_1', 'column_2']
        result_1 = result['column_1'].values.tolist()
        result_2 = result['column_2'].values.tolist()
        return (jsonify(result_1, result_2))  # sending to front end
    else:
        return ("Hello")


@app.route("/search", methods=["POST"])
def search():
    if request.method == "POST":
        data = request.json
        aircraft = Database["aircraft data"]
        #print(data)
        # df = pd.read_excel("./aircraft_parts_data.xlsx", engine='openpyxl')
        # df = df[["Part Name", "Material Composition",
        #          "Age (years)", "Condition", "Manufacturer"]]
        # results = df[(df["Part Name"] == data["Part"]) & (df["Age (years)"] >= data["Age"]) & (df["Age (years)"] <= data["Age"]+10) & (
        #     df["Condition"] == data["Condition"]) & (df["Manufacturer"] == data["Manufacturer"]) & (df["Material Composition"] == data["Material"])]
        # results = results.to_json(orient="records")
        # return jsonify({"results": results})
        # return jsonify({"results":[]})
        results=aircraft.find({"Part Name":data["Part"],"Condition":data["Condition"],"Manufacturer":data["Manufacturer"],"Material Composition":data["Material"],"Age (years)":{"$gte":data["Age"],"$lte":data["Age"]+10}})
        results=dumps(list(results))
        return jsonify({"results":results})

@app.route("/bivarite", methods=["GET", "POST"])
def bivarite():
    if request.method == "POST":
        request_data = request.get_json()
        col1 = request_data['column_1']  # parts
        col2 = request_data['column_2']  # age
        label = t[col1].tolist()
        data = t[col2].tolist()
        label = label[0:300]
        data = data[0:300]
        lst = []
        tempr = t[col1].unique().tolist()
        tempr = tempr[0:50]
        g = t.groupby(col1)
        for i in tempr:
            g_list = g.get_group(i)[col2].values.tolist().sort()
            g_list = g.get_group(i)[col2].to_numpy()
            g_list = np.sort(g_list).tolist()
            lst.append(g_list)
        # return (jsonify(lst,tempr))
        lstt = []
        for i in range(len(tempr)):
            lstt.append({'x': tempr[i], 'y': lst[i]})
        # lstt=lstt[1:100]
        return (jsonify(lstt, f'{label}', f'{data}'))
    else:
        return ("Hello")


@app.route("/fetch_columns", methods=["GET", "POST"])
def fetch_columns():
    if request.method == "POST":
        column_list = t.columns.tolist()
        column_list = column_list[1:]
        t1 = column_list[0:2]
        t2 = column_list[2:4]
        t3 = column_list[5:]
        column_list = t1+t3+t2
        list = []
        for i in range(len(column_list)):
            list.append({'value': column_list[i], 'label': column_list[i]})
        lstt = []
        list = list[1:]
        for i in range(len(column_list)):
            lstt.append({'x': column_list[i], 'y': 1})
        return (jsonify(list, lstt))
    else:
        return ("Hello")


if __name__ == "__main__":
    app.run(debug=True)
