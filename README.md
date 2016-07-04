# vast
This is the repo created for VAST Challenge 2016.

### How to start the server:
#### make sure you have pip and python2 installed
##### prerequisites:
```
pip install -r /path/to/requirements.txt
```
##### start (tested 06-14-2016):
```
python __init__.py
```
##### example usage:
```
Visit http://localhost:8000/all_haz_data to see all haz_data in json array
```
Further Change: Add Async to handle concurrency

### How to start the _Node Server_:
#### make sure you have node installed

##### start: go to the node_server folder
```
node get_data.js
```
##### example usage:
```
Visit 127.0.0.1:1337/haz_data/start-time/end-time  
```  
start time and end time are in second counting from 0:00 May-31, it will return data form start to end

### How to start the stream Server_:
#### make sure you have node installed

##### start: go to the node_server folder
```
npm install
node server.js
```
##### usage:
```
Visit localhost:8081/stream
```  
Current issue: json file seems not correct, please use http interface for now.
