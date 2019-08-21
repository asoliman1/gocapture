//
//  CameraOverlayView.m
//  GoCapture
//
//  Created by Sergij Rylskyj on 10/24/18.
//

#import "CameraOverlayView.h"
#import "GCImageScroller.h"

@interface CameraOverlayView()<GCImageScrollerDelegate>

@property (strong, nonatomic) IBOutlet UIView *contentView;
@property (weak, nonatomic) IBOutlet UIButton *captureBtn;
@property (weak, nonatomic) IBOutlet UIView *cameraView;
@property (weak, nonatomic) IBOutlet UIButton *closeBtn;
@property (weak, nonatomic) IBOutlet UIView *containerView;
@property (weak, nonatomic) IBOutlet GCImageScroller *imageScroller;
@property (weak, nonatomic) IBOutlet UIButton *submitBtn;
@property (weak, nonatomic) IBOutlet NSLayoutConstraint *imageScrollerTopConstraint;

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

    self.imageScroller.delegate = self;
}

- (void)setupCaptureView:(CGRect)internalRect isRapidScan:(BOOL)isRapidScan
{
    self.imageScrollerTopConstraint.constant = internalRect.origin.y + internalRect.size.height + 10;
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

    [self.cameraView.layer addSublayer: fillLayer];
    [self.containerView addSubview:imageView];

    //Camera btn

    NSString *cameraImagePath = [bundle pathForResource:@"camera-icon" ofType:@"png"];
    UIImage *cameraImage = [UIImage imageWithContentsOfFile:cameraImagePath];

    [self.captureBtn setImage:cameraImage forState:UIControlStateNormal];

    //Close btn

    NSString *closeImagePath = [bundle pathForResource:@"close-icon@2x" ofType:@"png"];
    UIImage *closeImage = [UIImage imageWithContentsOfFile:closeImagePath];

    [self.closeBtn setImage:closeImage forState:UIControlStateNormal];

    //info label

    UILabel *textLbl = [[UILabel alloc] initWithFrame:CGRectMake(0, internalRect.origin.y - 50, self.frame.size.width, 30)];

    textLbl.text = @"Tap to focus";
    textLbl.font = [UIFont systemFontOfSize:18];
    textLbl.textColor = [UIColor whiteColor];
    textLbl.textAlignment = NSTextAlignmentCenter;

    [self.containerView addSubview:textLbl];

    self.submitBtn.hidden = !isRapidScan;
    self.imageScroller.hidden = !isRapidScan;

    self.submitBtn.enabled = NO;
    self.submitBtn.alpha = 0.3;
}

- (void)reloadImageScrollerWithImages:(NSArray *)images
{
    self.submitBtn.enabled = images.count > 0;
    self.submitBtn.alpha = self.submitBtn.enabled ? 1 : 0.3;
    [self.imageScroller reloadWithImages:images];
}

- (void)reloadImageScroller
{
    [self.imageScroller reload];
}


- (IBAction)onTakePicture:(UIButton *)sender
{
    [self.delegate onTakePicture];
}

- (IBAction)onClose:(UIButton *)sender
{
    [self.delegate onClose];
}

- (IBAction)onSubmit:(UIButton *)sender
{
     [self.delegate onSubmit];
}

#pragma mark - GCImageScrollerDelegate


- (void)scrollerDidSelectImageAtIndex:(NSUInteger)index
{
    [self.delegate onItemActions:index];
}

@end
