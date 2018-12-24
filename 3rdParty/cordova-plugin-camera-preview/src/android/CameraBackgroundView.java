package com.cordovaplugincamerapreview;

import android.annotation.TargetApi;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.RectF;
import android.os.Build;
import android.util.AttributeSet;
import android.view.View;

import com.leadliaison.mobilitease.R;

public class CameraBackgroundView extends View {

    private Bitmap bitmap;


    public CameraBackgroundView(Context context) {
        super(context);
    }

    public CameraBackgroundView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public CameraBackgroundView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    public CameraBackgroundView(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
    }

    @Override
    protected void dispatchDraw(Canvas canvas) {
        super.dispatchDraw(canvas);

        if (bitmap == null) {
            createWindowFrame();
        }
        canvas.drawBitmap(bitmap, 0, 0, null);
    }

    protected void createWindowFrame() {
        bitmap = Bitmap.createBitmap(getWidth(), getHeight(), Bitmap.Config.ARGB_8888);
        Canvas osCanvas = new Canvas(bitmap);

        RectF outerRectangle = new RectF(0, 0, getWidth(), getHeight());

        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        paint.setColor(getResources().getColor(R.color.colorPrimary));
        paint.setAlpha(220);
        osCanvas.drawRect(outerRectangle, paint);

        paint.setColor(Color.TRANSPARENT);
        paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.SRC_OUT));
        float rectHeight = (float) ((getWidth() - getResources().getDimensionPixelSize(R.dimen.camera_overlay_horizontal_margin) * 2) / 1.75);
        float bottom = getResources().getDimensionPixelSize(R.dimen.camera_overlay_top_margin) + rectHeight;
        RectF innerRectangle = new RectF(getResources().getDimensionPixelSize(R.dimen.camera_overlay_horizontal_margin), getResources().getDimensionPixelSize(R.dimen.camera_overlay_top_margin), getWidth() - getResources().getDimensionPixelSize(R.dimen.camera_overlay_horizontal_margin), bottom);
        osCanvas.drawRect(innerRectangle, paint);
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        super.onLayout(changed, left, top, right, bottom);

        bitmap = null;
    }

    @Override
    public boolean isInEditMode() {
        return true;
    }
}
