# Guest book Api

Database: mongodb

## End Points

### Get messages
GET  /api/messages
##### response
       {
      "messages": [
              {
                  "id": "",
                  "username": "",
                  "content": "",
                  "replies": [],
                  "creationDate": ,
                  "lastUpdateDate": null
              }
                ]
       }       
        
### Get message
GET  /api/messages/[id]
##### response
      {
          "message": {
              "id": "",
              "username": "",
              "content": "",
              "replies": [
                  {
                      "id": "",
                      "username": ",
                      "content": "",
                      "creationDate": 
                  }
              ],
              "creationDate": ,
              "lastUpdateDate": 
          }
      }


### Create message
POST  /api/messages

      body {
          "username": "", "content": ""
      }
##### response
      {
          "newMessageId": ""
      }

### Update message
PUT  /api/messages/[id]

      body {
          "username": "", "content": ""
      }

#### a reply to a message can be added:
PUT  /api/messages/[id]

      body {
           "username": "",
           "content": "",
           "reply": {"username": "",
           "content": ""}
      }
##### response
       {
          "updatedMessageId": "621f16eece4f971d82799e28"
      }


### Delete message
DELETE /api/messages/[id]

      body
      {
          "username": ""
      }
##### response
       {
          "deletedMessageId": ""
      } 


