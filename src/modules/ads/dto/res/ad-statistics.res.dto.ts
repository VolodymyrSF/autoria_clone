import { ApiProperty } from '@nestjs/swagger';

export class AdStatisticsResDto {
  @ApiProperty({ description: 'Number of views of the ad' })
  viewsCount: number;

  @ApiProperty({ description: 'Number of views in the last day' })
  dailyViewsCount: number;

  @ApiProperty({ description: 'Number of views in the last week' })
  weeklyViewsCount: number;

  @ApiProperty({ description: 'Number of views in the last month' })
  monthlyViewsCount: number;

  @ApiProperty({
    description: 'Average price of similar cars in the same region',
  })
  averagePriceByRegion: number;

  @ApiProperty({ description: 'Average price of similar cars nationwide' })
  averagePriceNationwide: number;

  @ApiProperty({ description: 'Currency of price' })
  currency: string;
}
