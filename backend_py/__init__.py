import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
from tornado import gen
import logging
import pymongo
import json
from bson import json_util
from collections import deque
from tornado.options import define, options
define("port", default=8000, help="run on the given port", type=int)

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [(r"/all_haz_data", HazHandler)]
        client = pymongo.MongoClient("mongodb://ace:123456@ds013414.mlab.com:13414/vast")
        self.db = client['vast']
        tornado.web.Application.__init__(self, handlers, debug=True)

class HazHandler(tornado.web.RequestHandler):
    def get(self):
        haz_data = self.application.db.haz_data
        word_doc = haz_data.find()
        all_data = deque()
        for item in word_doc:
            item["_id"] = ""
            all_data.append(item)
        self.write(json.dumps(list(all_data)))

        # self.write(json.dumps(list(all_data)))
        # self.write(dumps(haz_data.find()))
        # json_docs = [doc for doc in word_doc]
        # self.write(json.dumps(json_docs, default=json_util.default))

def main():
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.port)
    logging.info('application starts......listenning on port : ' + str(options.port))
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
