import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DropboxController } from './dropbox.controller';
import { DropboxService } from './dropbox.service';

@Module({
  imports: [ConfigModule],
  controllers: [DropboxController],
  providers: [DropboxService],
})
export class DropboxModule {}
