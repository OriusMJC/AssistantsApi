import { Module } from '@nestjs/common';
import { DoctorController } from './controllers/doctor.controller';
import { DoctorService } from './services/doctor.service';

@Module({
  imports: [],
  // controllers: [DoctorController],
  // providers: [DoctorService],
})
export class DoctorModule {}