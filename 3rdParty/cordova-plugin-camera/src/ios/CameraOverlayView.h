//
//  CameraOverlayView.h
//  GoCapture
//
//  Created by Sergij Rylskyj on 10/24/18.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol CameraOverlayViewDelegate <NSObject>

- (void)onTakePicture;
- (void)onClose;

@end

@interface CameraOverlayView : UIView

@property (nonatomic, weak) id<CameraOverlayViewDelegate> delegate;

- (void)setupCaptureView:(CGRect)internalRect;

@end

NS_ASSUME_NONNULL_END
