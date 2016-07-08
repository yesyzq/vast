from pymongo import MongoClient
def connectDB():
    client = MongoClient()
    try:
        client = MongoClient("mongodb://ace:123456@ds013414.mlab.com:13414") #estabish connection
        print "connection success"
    except:
        print "connection fails"
    return client







