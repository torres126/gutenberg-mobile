
import UIKit
import RNTAztecView

class ExampleGutenbergViewController: UIViewController {
    let gutenberg = Gutenberg()
    let mediaProvider = MediaProvider()

    override func loadView() {
        view = gutenberg.rootView
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        addSaveButton()
        gutenberg.delegate = self
        guard let aztecManager = gutenberg.module(for: RCTAztecViewManager.self) as? RCTAztecViewManager else {
            fatalError("Aztec manager not found in RN Bridge modules.")
        }
        aztecManager.attachmentDelegate = mediaProvider.attachmentDelegate
        aztecManager.imageProvider = mediaProvider.attachmentImageProvider

        navigationController?.navigationBar.isTranslucent = false
    }

    func addSaveButton() {
        navigationItem.leftBarButtonItem = UIBarButtonItem(barButtonSystemItem: .save, target: self, action: #selector(saveButtonPressed(sender:)))
    }

    @objc func saveButtonPressed(sender: UIBarButtonItem) {
        gutenberg.requestHTML()
    }
}

extension ExampleGutenbergViewController: GutenbergBridgeDelegate {
    
    func gutenbergDidProvideHTML(_ html: String, changed: Bool) {
        print("Did receive HTML: \(html) changed: \(changed)")
    }

    func gutenbergDidRequestMediaPicker(callback: @escaping MediaPickerDidPickMediaCallback) {
        print("Gutenberg did request media picker, passing a sample url in callback")
        callback("https://cldup.com/cXyG__fTLN.jpg")
    }
}
