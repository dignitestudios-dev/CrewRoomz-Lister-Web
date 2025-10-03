type confirmationModalProps = {
  title: string;
  content: string;
  skipBtnContent: string;
  confirmBtnContent: string;
  onClose: () => void;
  onSubmit: () => void;
};

const ConfirmationModal: React.FC<confirmationModalProps> = ({
  title,
  content,
  skipBtnContent,
  confirmBtnContent,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 bg-[#04080680] bg-opacity-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-[400px] text-center shadow-lg">
        <div className="flex flex-col items-center">
          <p className="text-[24px] text-[#181818] font-semibold">{title}</p>
          <p className="text-[16px] text-[#565656]  text-center">{content}</p>

          <div className="flex justify-between items-center gap-4 w-[280px] pt-2">
            <button
              onClick={() => onClose()}
              className="border-[1px] text-[12px] font-[500] rounded-md border-[#E3DBDB] py-3 w-[160px]"
            >
              {skipBtnContent}
            </button>
            <button
              onClick={() => onSubmit()}
              className="bg-[#DC1D00] text-[12px] font-[500] text-[#ffffff] rounded-md py-3 w-[160px]"
            >
              {confirmBtnContent}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
