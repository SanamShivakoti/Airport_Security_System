from channels.generic.websocket import AsyncJsonWebsocketConsumer

class PracticeConsumer(AsyncJsonWebsocketConsumer):

     async def connect(self):
          await self.accept()

     async def receive(self, text_data=None, bytes_data=None, **kwargs):
          print(text_data)
          await self.send('PONG')
