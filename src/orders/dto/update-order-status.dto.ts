import { IsEnum } from 'class-validator';

export class UpdateOrderStatusDto {
    @IsEnum({ Review: 'Review', Processing: 'Processing', Completed: 'Completed' })
    status: 'Review' | 'Processing' | 'Completed';
}
