import json
import os,sys
import numpy as np
from pprint import pprint
import matplotlib.pyplot as plt

#floor1 = json.loads(open('floor1-MC2.json').read())
#floor2 = json.loads(open('floor2-MC2.json').read())
#floor3 = json.loads(open('floor3-MC2.json').read())
proxout = json.loads(open('proxOut-MC2.json').read())

'''
dat = '2016-05-31 00'
date_list = [0]
#record the date change index in json floor1
for i in range (0, len(floor3)):
    if not dat in floor3[i]["Date/Time"]:
        date_list.append(i)
        dat = floor3[i]["Date/Time"][0:10]
print (date_list)
'''

sensor=[]
for index in range(0, len(proxout)):
    exist = False
    for i in range (0, len (sensor)):
        # check whether the floor-zone has been recorded as key in sensor
        if (proxout[index]["message"]["zone"] in sensor[i][6:17]) and (proxout[index]["message"]["floor"] in sensor[i][1:3]):
            exist = True
    if exist == False:
        sensor.append("F_"+proxout[index]["message"]["floor"]+"_Z_"+proxout[index]["message"]["zone"])
print (sensor)


for key in sensor:
    #start: 2016-05-31 00
    time = proxout[0]["message"]["datetime"][0:13]
    result =[]
    
    n = 0   #number of people
    for i in range(0, len(proxout)):        
        # within the hour
        if time in proxout[i]["message"]["datetime"]:
            # find the corresponding zone
            if (proxout[i]["message"]["zone"] in key[6:17]) and (proxout[i]["message"]["floor"] in key[1:3]):
                n = n + 1
        else:
            result.append(n)
            n = 0
                
            #update time
            hour = int (time[11:13])
            if hour < 23 and hour >= 9:
                time = time[0:11] + str(hour+1)
            elif hour < 9:
                time = time[0:11] + '0' + str(hour+1)
            elif hour == 23 and time[0:10] == '2016-06-13':
                break
            else:
                
                if time[0:10] == '2016-05-31':
                    time = '2016-06-01 00'
                else:
                    date = int (time[8:10])
                    if date >= 9:
                        time = time[0:8] + str(date+1) + ' 00'                  
                    if date < 9:
                        time = time[0:8] + '0' + str(date+1) + ' 00'
                    
                
                
    #print(time+' + '+key)
    filename = key+'.png'
    plt.clf()
    plt.plot(result)
    plt.savefig(filename)
    

