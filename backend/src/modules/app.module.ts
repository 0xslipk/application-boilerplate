import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/application')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
