import json
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
length = len(list_f3z1)
i=0
totalflz8a = 0
totalf2z2 = 0
totalf2z4=0
totalf3z1=0
dayData = [dict() for y in range(0, 14)]
for num in range(0, 4032):
    offset = list_f1z8a[num]['offset']
    module = offset % 86400
    if (module == 0 and offset != 0) or offset ==1209300.0:
        dayData[i]['flz8a'] = totalflz8a
        dayData[i]['f2z2'] = totalf2z2
        dayData[i]['f2z4'] = totalf2z4
        dayData[i]['f3z1'] = totalf3z1
        dayData[i]['day'] = i+1
        totalflz8a = 0
        totalf2z2 = 0
        totalf2z4 = 0
        totalf3z1 = 0
        i+=1
    totalflz8a += float(list_f1z8a[num]['message']['F_1_Z_8A: Hazium Concentration'])
    totalf2z2 += float(list_f2z2[num]['message']['F_2_Z_2: Hazium Concentration'])
    totalf2z4 += float(list_f2z4[num]['message']['F_2_Z_4: Hazium Concentration'])
    totalf3z1 += float(list_f3z1[num]['message']['F_3_Z_1: Hazium Concentration'])
json_data = json.dumps(dayData, indent=4)
try:
    haz = open("building_json/haz_day.json", "w")
except:
    print "open file fails"
try:
    haz.write(json_data)
except:
    print "problem"