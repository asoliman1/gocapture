//
//  GCImageScroller.m
//  GoCapture
//
//  Created by Sergij Rylskyj on 6/18/19.
//

#import "GCImageScroller.h"
#import "GCImageScrollerCell.h"

@interface GCImageScroller()<UICollectionViewDelegate, UICollectionViewDataSource>
@property (strong, nonatomic) IBOutlet UIView *imagesScrollerView;
@property (weak, nonatomic) IBOutlet UICollectionView *imagesCollectionView;

@property (nonatomic, strong) NSArray *images;

@end

@implementation GCImageScroller

- (void)awakeFromNib
{
    [super awakeFromNib];
    
    [[NSBundle mainBundle] loadNibNamed:@"GCImageScroller" owner:self options:nil];
    
    [self.imagesCollectionView registerNib:[UINib nibWithNibName:@"GCImageScrollerCell" bundle:nil] forCellWithReuseIdentifier:@"GCImageScrollerCell"];
    
    [self addSubview:self.imagesScrollerView];
}

- (void)reloadWithImages:(NSArray *)images
{
    self.images = images;
    [self.imagesCollectionView performBatchUpdates:^{
        [self.imagesCollectionView reloadSections:[NSIndexSet indexSetWithIndex:0]];
    } completion:nil];
}

- (void)reload
{
    if (self.imagesCollectionView.indexPathsForSelectedItems.count > 0)
    {
        [self.imagesCollectionView performBatchUpdates:^{
            [self.imagesCollectionView reloadItemsAtIndexPaths:self.imagesCollectionView.indexPathsForSelectedItems];
        } completion:nil];
    }
}

#pragma mark - UICollectionViewDataSource


- (nonnull __kindof UICollectionViewCell *)collectionView:(nonnull UICollectionView *)collectionView cellForItemAtIndexPath:(nonnull NSIndexPath *)indexPath {
    
    static NSString *reuseIdentifier = @"GCImageScrollerCell";
    
    GCImageScrollerCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:reuseIdentifier forIndexPath:indexPath];
    [cell setupWithImage:self.images[indexPath.row]];
     return cell;
}

- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView
{
    return 1;
}

- (NSInteger)collectionView:(nonnull UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return self.images.count;
}

#pragma mark - UICollectionView Delegate


- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath
{
    [self.delegate scrollerDidSelectImageAtIndex:indexPath.row];
}

@end
