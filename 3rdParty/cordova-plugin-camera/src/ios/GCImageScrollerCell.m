//
//  GCImageScrollerCell.m
//  GoCapture
//
//  Created by Sergij Rylskyj on 6/18/19.
//

#import "GCImageScrollerCell.h"

@interface GCImageScrollerCell()

@property (weak, nonatomic) IBOutlet UIImageView *thumbImageView;

@end

@implementation GCImageScrollerCell

- (void)setupWithImage:(UIImage *)image
{
    self.thumbImageView.image = image;
}
@end
