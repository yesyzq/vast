import json
import csv
def openfile( filename ):
    temp = open(filename)
    string_data = temp.read()
    list_data = json.loads(string_data)
    temp.close()
    return list_data
names = openfile("C:/wamp64/www/vast/building_json/employee.json")
records = openfile("C:/wamp64/www/vast/building_json/proxOut-MC2.json")
length = len(names)
data = [dict() for x in range(0, length)]
count = 0
for name in names:
    data[count]['card_nanme'] = name['Card_name']
    data[count]['Department'] = name['Department']
    data[count]['office'] = name['Office']
    data_indi = []
    for record in records:
        if name['Card_name'] == record['message']['proxCard'][:-3]:
            enter = dict()
            enter['time'] = record['offset']
            enter['zone'] = record['message']['zone']
            enter['floor'] = int(record['message']['floor'])
            enter['floor_zone'] = record['message']['floor']+"_"+record['message']['zone']
            enter['day'] = int(record['offset']/86400) + 1
            enter['card_num'] = int(record['message']['proxCard'][-3:])
            data_indi.append(enter)
    data[count]['route'] = data_indi
    count += 1
json_data = json.dumps(data, indent=4)
try:
    route = open("C:/wamp64/www/vast/building_json/route.json", "w")
except:
    print "open file fails"
try:
    route.write(json_data)
except:
    print "problem"
route.close()








