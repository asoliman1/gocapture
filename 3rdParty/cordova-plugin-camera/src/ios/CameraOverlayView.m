//
//  CameraOverlayView.m
//  GoCapture
//
//  Created by Sergij Rylskyj on 10/24/18.
//

#import "CameraOverlayView.h"

@interface CameraOverlayView()

@property (strong, nonatomic) IBOutlet UIView *contentView;

@end

@implementation CameraOverlayView

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame: frame];

    if (self)
    {
        [self commonInit];
    }
    return self;
}

- (instancetype)initWithCoder:(NSCoder *)aDecoder
{
    self = [super initWithCoder: aDecoder];

    if (self)
    {
        [self commonInit];
    }
    return self;
}

- (void)commonInit
{
    [[NSBundle mainBundle] loadNibNamed:@"CameraOverlayView" owner:self options:NULL];
    [self addSubview:self.contentView];
    self.contentView.frame = self.bounds;
}

- (void)setupCaptureView:(CGRect)internalRect
{
    CGRect rect = self.contentView.frame;

    UIBezierPath *pathBigRect = [UIBezierPath bezierPathWithRect:rect];
    UIBezierPath *pathSmallRect = [UIBezierPath bezierPathWithRect:internalRect];

    NSURL *bundleURL = [[NSBundle mainBundle] URLForResource:@"CameraOverlayView" withExtension:@"bundle"];
    NSBundle *bundle = [NSBundle bundleWithURL:bundleURL];

    NSString *businessCardImagePath = [bundle pathForResource:@"business_card_overlay@2x" ofType:@"png"];
    UIImage *businessCardImage = [UIImage imageWithContentsOfFile:businessCardImagePath];

    UIImageView *imageView = [[UIImageView alloc] initWithImage:businessCardImage];

    imageView.frame = internalRect;

    [pathBigRect appendPath:pathSmallRect];
    pathBigRect.usesEvenOddFillRule = YES;

    CAShapeLayer *fillLayer = [CAShapeLayer layer];
    fillLayer.path = pathBigRect.CGPath;
    fillLayer.fillRule = kCAFillRuleEvenOdd;
    fillLayer.fillColor = [UIColor blackColor].CGColor;

    [self.layer addSublayer: fillLayer];
    [self addSubview:imageView];

    //Camera btn

    UIButton *takePictureBtn = [UIButton buttonWithType:UIButtonTypeCustom];

    takePictureBtn.frame = CGRectMake(0, 0, 30, 30);

    [takePictureBtn addTarget:self action:@selector(onTakePicture:) forControlEvents:UIControlEventTouchUpInside];

    NSString *cameraImagePath = [bundle pathForResource:@"camera-icon" ofType:@"png"];
    UIImage *cameraImage = [UIImage imageWithContentsOfFile:cameraImagePath];

    [takePictureBtn setImage:cameraImage forState:UIControlStateNormal];

    takePictureBtn.center = CGPointMake(CGRectGetMidX(self.bounds), self.frame.size.height - 80);

    [self addSubview:takePictureBtn];

    //Close btn

    UIButton *closeBtn = [UIButton buttonWithType:UIButtonTypeCustom];

    closeBtn.frame = CGRectMake(self.frame.size.width - 60, 30, 30, 30);

    [closeBtn addTarget:self action:@selector(onClose:) forControlEvents:UIControlEventTouchUpInside];

    NSString *closeImagePath = [bundle pathForResource:@"close-icon@2x" ofType:@"png"];
    UIImage *closeImage = [UIImage imageWithContentsOfFile:closeImagePath];

    [closeBtn setImage:closeImage forState:UIControlStateNormal];

    [self addSubview:closeBtn];

    //info label

    UILabel *textLbl = [[UILabel alloc] initWithFrame:CGRectMake(0, internalRect.origin.y - 50, self.frame.size.width, 30)];

    textLbl.text = @"Tap to focus";

    textLbl.font = [UIFont systemFontOfSize:18];

    textLbl.textColor = [UIColor whiteColor];
    textLbl.textAlignment = NSTextAlignmentCenter;

    [self addSubview:textLbl];
}


- (void)onTakePicture:(UIButton *)sender
{
    [self.delegate onTakePicture];
}

- (void)onClose:(UIButton *)sender
{
    [self.delegate onClose];
}


@end
