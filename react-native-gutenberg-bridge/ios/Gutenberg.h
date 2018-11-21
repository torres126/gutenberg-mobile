#import <UIKit/UIKit.h>
#import "GutenbergBridgeDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@interface Gutenberg : NSObject

@property (nonatomic, weak, nullable) id<GutenbergBridgeDelegate> delegate;
@property (nonatomic, strong, readonly) UIView* rootView;

- (instancetype)initWithProps:(nullable NSDictionary<NSString *, id> *)props NS_DESIGNATED_INITIALIZER;

/**
 * Invalidates the gutenberg bridge.
 * Call this on dealloc (or deinit) to avoid retain cycles.
 */
- (void)invalidate;

/**
 * Returns the Native Module for the given class from the React Native Bridge module list.
 *
 * @param aClass The class of the module requested.
 * @return An instance of the module or nil.
 */
- (nullable id)moduleForClass:(Class)aClass;

#pragma mark - Messages

- (void)requestHTML;

@end

NS_ASSUME_NONNULL_END
