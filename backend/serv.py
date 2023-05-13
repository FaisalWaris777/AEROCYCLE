from email.utils import collapse_rfc2231_value
from flask import Flask,request,Response
from flask import jsonify
from flask_cors import CORS,cross_origin
import pickle
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from flask import send_file 
import seaborn as sns
from sklearn import linear_model
from sklearn import svm
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import accuracy_score,r2_score
from sklearn.model_selection import train_test_split
from sklearn.compose import make_column_transformer
from sklearn.pipeline import make_pipeline

app = Flask(__name__)
CORS(app)
cors=CORS(app,resources={
     r"/*":{
         "origins":"http://localhost:3000" 
     }
})

# DataCleaning
csv_file=pd.read_csv('Engage_automobile_dataset.csv')
t=pd.read_csv('Engage_automobile_dataset.csv')
t['Drivetrain']=t['Drivetrain'].str.split(' ').str.get(0)
t['Ex-Showroom_Price']=t['Ex-Showroom_Price'].str.split(' ').str.get(1).str.replace(',','').astype(float)
t['Displacement']=t['Displacement'].str.split(' ').str.get(0).astype(float)
t['Emission_Norm']=t['Emission_Norm'].str.replace('IV','4')
t['Emission_Norm']=t['Emission_Norm'].str.replace('III','3')
t['Emission_Norm']=t['Emission_Norm'].str.replace('VI','6')
t['Fuel_Tank_Capacity']=t['Fuel_Tank_Capacity'].str.split(' ').str.get(0).astype(float)
t['Height']=t['Height'].str.split(' ').str.get(0).astype(float)
t['Length']=t['Length'].str.split(' ').str.get(0).astype(float)
t['Width']=t['Width'].str.split(' ').str.get(0).astype(float)
t['Wheelbase']=t['Wheelbase'].str.split(' ').str.get(0).astype(float)
t['Power']=t['Power'].str.split('@').str.get(0).str.extract('(\d+)').astype(float)
t['Torque']=t['Torque'].str.split('@').str.get(0).str.extract('(\d+)').astype(float)
t['Kerb_Weight']=t['Kerb_Weight'].str.extract('(\d+)').astype(float)
t['City_Mileage']=t['City_Mileage'].str.extract('(\d+)').astype(float)
t['Gears']=t['Gears'].str.replace('7 Dual Clutch','7')
t['Gears']=t['Gears'].str.replace('Single Speed Reduction Gear','1').astype(float)
t.rename(columns = {'Ex-Showroom_Price':'Ex-Showroom_Price(in Rs)', 'Displacement':'Displacement(in cc)','City_Mileage':'City_Mileage(in km/litre)','Kerb_Weight':'Kerb_Weight(in kg)','Fuel_Tank_Capacity':'Fuel_Tank_Capacity(in litres)','Height':'Height(in mm)','Length':'Length(in mm)','Width':'Width(in mm)','Power':'Power(in PS)','Torque':'Torque(in Nm)','Wheelbase':'Wheelbase(in mm)'}, inplace = True)

#Handling Null Values
t["Make"]=t["Make"].fillna(t['Model'].apply(lambda x : x.split(' ')[0]))
t["Make"]=t["Make"].replace('Go+','Datsun')
t["Make"]=t["Make"].replace('Maruti Suzuki R','Maruti Suzuki')
t['Odometer']=t['Odometer'].str.replace('Yes','Digital')
t['Speedometer']=t['Speedometer'].str.replace('Yes','Analog')
t['Cylinders']=t['Cylinders'].fillna(t['Cylinders'].mode()[0]) 
t['Doors']=t['Doors'].fillna(t['Doors'].mode()[0])
t['Seating_Capacity']=t['Seating_Capacity'].fillna(t['Seating_Capacity'].mode()[0]) 
temp2=t.columns.tolist()
temp2=temp2[6:]
for i in temp2:
    if type(t[i][0])==float:
        t[i]=t[i].fillna(t[i].mean()) 
    else:
       t[i]=t[i].fillna(t[i].mode()[0])


@app.route("/fetch_correlation_data",methods=["GET","POST"])
def fetch_correlation_data():
     if request.method=="POST":
          request_data=request.get_json()
          col1=request_data['column_1']
          col2=request_data['column_2']
          result_1=t[col1].astype('category').cat.codes
          result_2=t[col2].astype('category').cat.codes
          correlation_value=result_1.corr(result_2)
          data_1=[]
          data_2=[]
          for i in range(50):
            data_1.append([i,result_1[i]])
            data_2.append([i,result_2[i]])
          list=[]
          list.append({'name':col1,'data':data_1})
          list.append({'name':col2,'data':data_2}) 
          return (jsonify(f'{data_1}',f'{data_2}',f'{correlation_value}'))
     else:
        return("Hello")     

@app.route("/fetch_columns",methods=["GET","POST"])
def fetch_columns():
    if request.method=="POST":
     column_list=t.columns.tolist()
     column_list=column_list[1:]
     t1=column_list[0:2]
     t2=column_list[2:4]
     t3=column_list[5:]
     column_list=t1+t3+t2
     list=[]
     for i in range(len(column_list)):
        list.append({ 'value': column_list[i], 'label': column_list[i] })
     lstt=[]
     list=list[1:]
     for i in range(len(column_list)):
        lstt.append({ 'x': column_list[i], 'y': 1 })      
     return(jsonify(list,lstt))
    else:
       return("Hello")   

@app.route("/fetch_yearly_data",methods=["GET","POST"])
def fetch_yearly_data():
    if request.method=="POST":
     company=t['Make'].value_counts().reset_index()
     company.columns=['column_1','column_2']
     company=company['column_1'].tolist()
     company=company[0:5]
     list=[]
     list_name=[]
     df=pd.DataFrame()
     c_group=pd.DataFrame()
     for i in company:
      g=t.groupby('Make')
      c_group=g.get_group(i).reset_index()
      df['Date'] = pd.to_datetime(c_group['Launch_Date'])
      yr_2019=df[df['Date'].dt.year == 2019].count().Date
      yr_2020=df[df['Date'].dt.year == 2020].count().Date
      yr_2021=df[df['Date'].dt.year == 2021].count().Date
      yr_2022=df[df['Date'].dt.year == 2022].count().Date
      list.append([yr_2019,yr_2020,yr_2021,yr_2022])
      list_name.append(i)
     return (jsonify(f'{list}',list_name))
    else:
       return("Hello") 

@app.route("/fetch_companies",methods=["GET","POST"])
def fetch_companies():
    if request.method=="POST":
     companies_list=t['Make'].unique().tolist()
     list=[]
     for i in range(len(companies_list)):
        list.append({ 'value': companies_list[i], 'label': companies_list[i] })
     return(jsonify(list))     
    else:
       return("Hello")   

@app.route("/fetch_make",methods=["GET","POST"])
def fetch_make():
     if request.method=="POST":
          request_data=request.get_json()
          column_name=request_data['column_name']
          result=t[column_name].value_counts().reset_index()
          result.columns=['column_1','column_2']
          result_1=result['column_1'].values.tolist()
          result_2=result['column_2'].values.tolist()
          column_name='Make'
          uncleaned=[]
          list=[]
          for i in range(len(result_1)):
            list.append({ 'x': result_1[i], 'y': result_2[i] })
          row=len(csv_file.index)
          column=len(csv_file.columns)
          elements=csv_file.size
          uncleaned.append(row)
          uncleaned.append(column)
          uncleaned.append(elements)    
          return (jsonify(result_1,result_2,f'{uncleaned}')) #sending to front end
     else:
       return("Hello") 

@app.route("/fetch_data",methods=["GET","POST"])
def fetch_data():
     if request.method=="POST":
          request_data=request.get_json()
          column_name=request_data['column_name']
          result=t[column_name].value_counts().reset_index()
          result.columns=['column_1','column_2']
          result_1=result['column_1'].values.tolist()
          result_2=result['column_2'].values.tolist()
          return (jsonify(result_1,result_2)) #sending to front end
     else:
       return("Hello") 

@app.route("/fetch_bivarite",methods=["GET","POST"])
def funct5():
     if request.method=="POST":
          request_data=request.get_json()
          col1=request_data['column_1']
          col2=request_data['column_2']
          label=t[col1].tolist()
          data=t[col2].tolist()
          label=label[0:300]
          data=data[0:300]
          lst=[]
          tempr=t[col1].unique().tolist()
          tempr=tempr[0:50]
          g=t.groupby(col1)
          for i in tempr:
           g_list=g.get_group(i)[col2].values.tolist().sort()
           g_list=g.get_group(i)[col2].to_numpy()
           g_list=np.sort(g_list).tolist()
           lst.append(g_list)  
          # return (jsonify(lst,tempr))
          lstt=[]
          for i in range(len(tempr)):
            lstt.append({ 'x': tempr[i], 'y': lst[i]})
          # lstt=lstt[1:100]  
          return (jsonify(lstt,f'{label}',f'{data}')) 
     else:
        return("Hello")    

@app.route("/company_data",methods=["GET","POST"])
def company_data():
   if request.method=="POST":
     request_data=request.get_json()
     company=request_data['company_name']
     g=t.groupby('Make')
     
     model=g.get_group(company)['Model'].value_counts().reset_index()
     model.columns=['column_1','column_2']
     model_label=model['column_1'].values.tolist() 
     model_data=model['column_2'].values.tolist()
     new_list=[]
     for i in model_data:
       new_list.append(round(i/len(g.get_group(company))*100,2))
     model_data=new_list  

     percentage=len(g.get_group(company))/len(t)*100;
     percentage=round(percentage, 2)

     list3=[]
     company_g=g.get_group(company).reset_index()
     model_g=company_g.groupby('Model')
     for i in model_label:
       engine=model_g.get_group(i)['Power(in PS)'].tolist()
       price=model_g.get_group(i).reset_index()['Ex-Showroom_Price(in Rs)'].tolist()
       list3.append([engine,price])  
 
     model_list=[]
     for i in range(len(model_label)):
        model_list.append({ 'value': model_label[i], 'label': model_label[i] })  
     return (jsonify(model_data,model_label,model_list,list3,percentage))
   else:
       return("Hello") 
     

@app.route("/company_component_3",methods=["GET","POST"])
def company_component_3():
   if request.method=="POST":
     request_data=request.get_json()
     company=request_data['company_name']
     g=t.groupby('Make')   
     fuel=g.get_group(company)['Fuel_Type'].value_counts().reset_index()
     fuel.columns=['column_1','column_2']
     fuel_label=fuel['column_1'].values.tolist()
     fuel_data=fuel['column_2'].values.tolist()

     body=g.get_group(company)['Body_Type'].value_counts().reset_index()
     body.columns=['column_1','column_2']
     body_label=body['column_1'].values.tolist()
     body_data=body['column_2'].values.tolist()
     return (jsonify(fuel_data,fuel_label,body_data,body_label))    
   else:
       return("Hello")   

@app.route("/model_data",methods=["GET","POST"])
def model_data():
    if request.method=="POST": 
      request_data=request.get_json()
      company=request_data['company_name']
      model=request_data['model_name']
      make_g=t.groupby('Make')
      company_g=make_g.get_group(company).reset_index()
      model_g=company_g.groupby('Model')
      model_df=model_g.get_group(model).reset_index()
      model_df=model_df[['Variant','Displacement(in cc)','Ex-Showroom_Price(in Rs)','Power(in PS)','City_Mileage(in km/litre)']].to_numpy()
      model_df=model_df.tolist()
      return (jsonify(model_df))
    else:
       return("Hello")   
     
@app.route("/boxplot",methods=["GET","POST"])
def boxplot():
    if request.method=="POST": 
         request_data=request.get_json()
         company=request_data['company']
         column_name=request_data['column_name']
         g=t.groupby('Make')
         drivetrain_col=g.get_group(company)[column_name].unique().tolist()
         temp=g.get_group(company).reset_index()
         drive_g=temp.groupby(column_name)
         list=[]    
         for i in drivetrain_col:
           g_list=drive_g.get_group(i)['Ex-Showroom_Price(in Rs)'].values.tolist()
           list.append({ 'x': i, 'y': sorted(g_list, key = lambda x:float(x)) }) 
         return jsonify(list) 
    else:
       return("Hello")   

@app.route("/power",methods=["GET","POST"])
def power():
   if request.method=="POST":
     request_data=request.get_json()
     company=request_data['company']
     column_name=request_data['column_name'] 
     g=t.groupby('Make')
     data=g.get_group(company).reset_index()
     data=data[[column_name,'Power(in PS)']]
     data=data.to_numpy().tolist()
     return jsonify(data)
   else:
       return("Hello")   

@app.route("/mileage",methods=["GET","POST"])
def mileage():
   if request.method=="POST":
     request_data=request.get_json()
     company=request_data['company']
     column_name=request_data['column_name'] 
     g=t.groupby('Make')
     data=g.get_group(company).reset_index()
     data=data[[column_name,'City_Mileage(in km/litre)']]
     data=data.to_numpy().tolist()
     return jsonify(data)
   else:
       return("Hello")   
     
     

@app.route("/company_numeric_col",methods=["GET","POST"])
def company_numeric_col():
   if request.method=="POST":
     request_data=request.get_json()
     company=request_data['company']
     column_name=request_data['column_name']
     g=t.groupby('Make')
     col_data=g.get_group(company)[column_name].tolist()
     return jsonify(col_data)
   else:
       return("Hello")   

@app.route("/multiple_line_chart",methods=["GET","POST"])
def multiple_line_chart():
   if request.method=="POST":
     request_data=request.get_json()
     company=request_data['company_name']
     col_1=request_data['col_1_name']
     g=t.groupby('Make')
     company_g=g.get_group(company).reset_index()
     fuel_label=company_g['Fuel_Type'].unique().tolist()
     fuel_g=company_g.groupby('Fuel_Type')
     list=[]
     for i in fuel_label:
       fuel=fuel_g.get_group(i)[col_1].tolist()
       list.append({'name':i,'data':fuel})  
     return (jsonify(list))
   else:
       return("Hello")   

@app.route("/top_5_cars",methods=["GET","POST"])
def top_5_cars():
   if request.method=="POST":
     request_data=request.get_json()
     column=request_data['column_name']
     df=t[t['Fuel_Type']!='Electric'].reset_index()
     df=df.nlargest(5,column)
     label=(df['Make']+"  "+df['Model']+" "+df['Variant']).tolist()
     data=df[column].tolist()
     spec=[]
     common=['Displacement(in cc)','City_Mileage(in km/litre)','Kerb_Weight(in kg)','Fuel_Tank_Capacity(in litres)','Power(in PS)','Torque(in Nm)','Body_Type','Type','Fuel_Type','Drivetrain']
     for i in common:
      spec.append(t[i].mode()[0])  
     return (jsonify(label,f'{data}',spec))
   else:
       return("Hello")   

@app.route("/fetch_prediction_col",methods=["GET","POST"])
def prediction_col():
   if request.method=="POST":
      col1=t['Cylinders'].unique().tolist()
      col2=t['Displacement(in cc)'].unique().tolist()
      list1=[]
      list2=[]
      for i in range(len(col1)):
            list1.append({ 'value': col1[i], 'label': col1[i]})
      for i in range(len(col2)):
            list2.append({ 'value': col2[i], 'label': col2[i]})      
      return (jsonify(list1,list2))     
   else:
       return("Hello")   

@app.route("/prediction_value",methods=["GET","POST"])
def prediction_value():
   if request.method=="POST":
     request_data=request.get_json()
     col1=request_data['input1']
     col2=request_data['input2']
     col3=request_data['input3']
     col4=request_data['input4']
     data = [[col1,col2,col4,col3]]
     df=pd.DataFrame(data, columns = ['Cylinders','Displacement(in cc)','Cylinder_Configuration','Fuel_System'])
     model=pickle.load(open("car_prediction_model.pkl",'rb'))
     ans=model.predict(df)
     ans=np.round(ans,2)
     if(ans<0):
      ans=abs(ans)
     return(f'{ans}')
   else:
       return("Hello")  

@app.route("/fetch_comp_names",methods=["GET","POST"])
def fetch_comp_names():
   if request.method=="POST":     
      col1=t['Make'].unique().tolist()
      list1=[]
      for i in range(len(col1)):
            list1.append({ 'value': col1[i], 'label': col1[i]})
      return jsonify(list1)
   else:
       return("Hello")        

if __name__=="__main__":
  app.run(debug=True)