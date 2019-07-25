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

- (void)awakeFromNib
{
    [super awakeFromNib];
    self.thumbImageView.layer.borderColor = [[UIColor colorWithRed:(255 / 255.0) green:(147 / 255.0) blue:0 alpha:1] CGColor];
    self.thumbImageView.clipsToBounds = YES;
    self.thumbImageView.layer.masksToBounds = YES;
    self.thumbImageView.layer.borderWidth = 0;
    self.thumbImageView.layer.cornerRadius = 5;
}

- (void)setupWithImage:(UIImage *)image
{
    self.thumbImageView.image = image;
}

- (void)setSelected:(BOOL)selected
{
    self.thumbImageView.layer.borderWidth = selected ? 2 : 0;
}

@end
