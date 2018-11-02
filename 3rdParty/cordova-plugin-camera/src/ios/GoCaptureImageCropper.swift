//
//  GoCaptureImageCropper.swift
//  GoCapture
//
//  Created by Sergij Rylskyj on 11/2/18.
//

import UIKit
import CoreML
import Vision
import ImageIO

extension CGRect {
    func scaled(to size: CGSize) -> CGRect {
        return CGRect(
            x: self.origin.x * size.width,
            y: self.origin.y * size.height,
            width: self.size.width * size.width,
            height: self.size.height * size.height
        )
    }
}

public typealias CropCompletionHandler = (_ image: UIImage) -> Void;

@objc public class GoCaptureImageCropper: NSObject {
    
    var completionHandler: CropCompletionHandler?;
    
    var inputImage: CIImage!
    
    @objc
    public func crop(uiImage: UIImage, completionHandler: @escaping CropCompletionHandler)   {
        self.completionHandler = completionHandler;
        let ciImage = CIImage(image: uiImage)
        let orientation = CGImagePropertyOrientation(rawValue: UInt32(uiImage.imageOrientation.rawValue))
        
        inputImage = ciImage?.oriented(forExifOrientation: Int32(orientation!.rawValue))
        let handler = VNImageRequestHandler(ciImage: ciImage!, orientation: CGImagePropertyOrientation(rawValue: orientation!.rawValue)!)
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                try handler.perform([self.rectanglesRequest])
//                let image = UIImage.init(ciImage: self.inputImage)  ;
            } catch {
                print(error)
            }
        }
    }
    
    lazy var rectanglesRequest: VNDetectRectanglesRequest = {
        var request = VNDetectRectanglesRequest(completionHandler: self.handleRectangles);
        return request;
    }()
    
    func handleRectangles(request: VNRequest, error: Error?) {
        guard let observations = request.results as? [VNRectangleObservation]
            else { fatalError("unexpected result type from VNDetectRectanglesRequest") }
        guard let detectedRectangle = observations.first else {
            print("No rectangles detected.")
            return
        }
        let imageSize = inputImage.extent.size
        
        // Verify detected rectangle is valid.
        let boundingBox = detectedRectangle.boundingBox.scaled(to: imageSize)
        guard inputImage.extent.contains(boundingBox)
            else { print("invalid detected rectangle"); return }
        
        // Rectify the detected image and reduce it to inverted grayscale for applying model.
        
        inputImage = inputImage
            .cropped(to: boundingBox)
        // Show the pre-processed image
        
        if let handler = self.completionHandler {
            DispatchQueue.main.async {
                handler(self.convert(cmage: self.inputImage));
            }
        }
    }
    
    func convert(cmage:CIImage) -> UIImage
    {
        let context:CIContext = CIContext.init(options: nil)
        let cgImage:CGImage = context.createCGImage(cmage, from: cmage.extent)!
        let image:UIImage = UIImage.init(cgImage: cgImage)
        return image
    }
}
