//
//  GCImageScroller.h
//  GoCapture
//
//  Created by Sergij Rylskyj on 6/18/19.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol GCImageScrollerDelegate <NSObject>

- (void)scrollerDidSelectImageAtIndex:(NSUInteger)index;

@end

@interface GCImageScroller : UIView

@property (nonatomic, assign) id<GCImageScrollerDelegate>delegate;

- (void)reloadWithImages:(NSArray *)images;

@end

NS_ASSUME_NONNULL_END
