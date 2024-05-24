const SuccessPopUp = ({ message }: { message: string }) => {
  return (
    <div className="successPopWrapper">
      <div>
        <div>
          <span className="removeSuccessPopUp">
            <p>x</p>
          </span>
          {message}
        </div>
      </div>
    </div>
  );
};

export default SuccessPopUp;
