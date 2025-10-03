import { Field, ErrorMessage } from "formik";

interface Props {
  index: number;
}

export const StandardBedPrice: React.FC<Props> = ({ index }) => {
  return (
    <div className="space-y-4">
      {/* Daily Price */}
      <div>
        <label className="block text-sm font-medium">Daily Price</label>
        <Field
          name={`bedTypes[${index}].dailyPrice`}
          type="text"
          className="w-full border rounded-md p-2"
          placeholder="Enter daily price"
        />
        <ErrorMessage
          name={`bedTypes[${index}].dailyPrice`}
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      {/* Monthly Price */}
      <div>
        <label className="block text-sm font-medium">Monthly Price</label>
        <Field
          name={`bedTypes[${index}].monthlyPrice`}
          type="text"
          className="w-full border rounded-md p-2"
          placeholder="Enter monthly price"
        />
        <ErrorMessage
          name={`bedTypes[${index}].monthlyPrice`}
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
    </div>
  );
};
