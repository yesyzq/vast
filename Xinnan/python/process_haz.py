import json
import connect_db
def openfile( filename ):
    temp = open(filename)
    string_data = temp.read()
    list_data = json.loads(string_data)
    temp.close()
    return list_data
list_f1z8a = openfile("building_json/f1z8a-MC2.json")
list_f2z2 = openfile("building_json/f2z2-MC2.json")
list_f2z4 = openfile("building_json/f2z4-MC2.json")
list_f3z1 = openfile("building_json/f3z1-MC2.json")
data = [dict() for x in range(0, 4032)]
length = len(list_f3z1)
for num in range(0, 4032):
    data[num]['time'] = list_f1z8a[num]['offset']
    data[num]['flz8a'] = list_f1z8a[num]['message']['F_1_Z_8A: Hazium Concentration']
    data[num]['f2z2'] = list_f2z2[num]['message']['F_2_Z_2: Hazium Concentration']
    data[num]['f2z4'] = list_f2z4[num]['message']['F_2_Z_4: Hazium Concentration']
    data[num]['f3z1'] = list_f3z1[num]['message']['F_3_Z_1: Hazium Concentration']
json_data = json.dumps(data, indent=4)
try:
    haz = open("building_json/haz_data.json", "w")
except:
    print "open file fails"
try:
    haz.write(json_data)
except:
    print "problem"
haz.close()
client = connect_db.connectDB()
db = client.vast #access database object
coll = db.haz_data
for one_data in data:
    result = coll.insert_one(one_data)
    if(result is not True):
        print "insertion fails"
