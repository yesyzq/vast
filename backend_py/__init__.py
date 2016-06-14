import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
from tornado import gen
import pymongo, logging, json

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
        all_data = []
        if word_doc:
            for item in word_doc:
                del item["_id"]
                all_data.append(item)
            self.write(json.dumps(all_data))
        else:
            self.set_status(404)
            self.write({"error": "word not found"})

def main():
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.port)
    logging.info('application starts......listenning on port : ' + str(options.port))
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
