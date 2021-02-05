import React,  { useState } from 'react';
import Footer from '../../components/Footer/Footer';
import Wallpaper from '../../components/Wallpaper/Wallpaper';
import submissionService from '../../services/submissionService';
import TSubmission from '../../models/SendSubmissionType';

const Submission: React.FC = () => {

  const sService = new submissionService;

  const [loading, setLoading] = useState(false)
  const [imageArray, setImageArray] = useState(new Array<String>());
  const [urlArray, setUrlArray] = useState(new Array<string>());
  
  const [submission, setSubmission] = useState<TSubmission>({
    title: "",
    description: "",
    benefit: "",
    contribution: "",
    skills: "",
    costs: "",
    maintenance: "",
    other: "",
    image: []
  });
  
  // nice-to-have show filenames when selected + a way to remove a file. 
  const handleInputText = (e: React.FormEvent<HTMLInputElement>) => {
    const {value, name} = e.currentTarget;  
    setSubmission({ ...submission, [name]: value});
  }

  const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => { 
    const {value, name} = e.currentTarget;  
    setSubmission({ ...submission, [name]: value});
  }

  // upload files to cloudinary, return url
  const uploadFile = async (file: any): Promise<string> => {
    console.log("inside uploadFile");
    const cloudinaryData = new FormData();
    cloudinaryData.append('file', file);
    cloudinaryData.append('upload_preset', 'communityactiononwaste');
    // send off image file
    const resCloudinary = await fetch(
      'https://api.cloudinary.com/v1_1/dura1eemm/image/upload',
      {
        method: 'POST',
        body: cloudinaryData
      }
    )
    // retrieve url
    const URL = await resCloudinary.json()
    const imageURL = URL.secure_url 

    // put url(s) from imgur inside a state array
    let tempArray = urlArray;
    tempArray.push(imageURL);
    setUrlArray(tempArray); 
    return "done";
  }

  // (e: React.ChangeEvent<HTMLInputElement>) was not working... using e: any for now
  const handleImage = async (e: any) => {
    setImageArray(e.target.files);
  }
  
  // validate submissions & send off the submission.
  const handleSubmit = async (e: React.FormEvent<EventTarget>) => { 
    e.preventDefault();
    
    for (let index = 0; index < imageArray.length; index++) {
      await uploadFile(imageArray[index]);
    }

    console.log("urlArray length: " + urlArray.length);
    console.log(urlArray);
    setSubmission({ ...submission, image: urlArray})

    console.log("send submission");
    sService.addSubmission(submission);
  }
  

  return (
  <>
    <Wallpaper />
      <div className="submission-content">
          <h1>Submission Form Coming Soon</h1>
          <h2>Please check back later this week! :-)</h2>
      </div>
      <div className="form-container">
        <form className="submission-form" onSubmit={handleSubmit}>
          <div className="form-content-wrapper">
            <div className="form-group">
              <label >Submission Name</label>
              <input type="text" className="form-control" placeholder="e.g. The Green Space" required name="title" onChange={handleInputText}/>
              <div className="invalid-feedback">
                Please choose a name of your submission.
              </div>
            </div>
            <div className="form-group">
              <label >In a few sentences, please explain your idea</label>
              <textarea className="form-control text-area" required name="description" onChange={handleTextArea}/>
            </div>
            <div className="form-group">
              <label >Who would benefit from your idea?</label>
              <textarea className="form-control text-area" name="benefit" onChange={handleTextArea}></textarea>
            </div>
            <div className="form-group">
              <label >How will your idea make a positive contribution to the Hyde park area?</label>
              <textarea className="form-control text-area" name="contribution" onChange={handleTextArea}></textarea>
            </div>          
            <div className="form-group">
              <label >Are there any practical skills needed to implement your idea?</label>
              <textarea className="form-control text-area" name="skills" onChange={handleTextArea}></textarea>
            </div>          
            <div className="form-group">
              <label >Outline the rough costs for your idea - how will it fit into the £250 budget?</label>
              <label className="sub-label">No need to be exact, just a rough estimate will do</label>
              <textarea className="form-control text-area" placeholder="" name="costs" onChange={handleTextArea}></textarea>
            </div>          
            <div className="form-group">
              <label >Will it need maintenance? If so, how might this happen?</label>
              <textarea className="form-control text-area" name="maintenance" onChange={handleTextArea}></textarea>
            </div>          
            <div className="form-group">
              <label >Is there anything else to consider?</label>
              <textarea className="form-control text-area" name="other" onChange={handleTextArea}></textarea>
            </div>   
            
          </div>
          <div className="form-check">
            <label>Feel free to draw or add example images which might help us to imagine your idea </label>

            <input type="file" className="form-control-file" name="image" onChange={handleImage} id="fileInput" multiple accept="image/*"/>
          </div>
          <div>
            {loading ? (<h3>Loading image...</h3>) : <h3/>}
          </div>
          <button type="submit" className="btn btn-primary" >Submit</button>
        </form>
      </div>
    <Footer /> 
  </>
  )
};
export default Submission;
