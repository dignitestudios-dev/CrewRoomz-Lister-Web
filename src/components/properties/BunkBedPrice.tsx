import { Field, ErrorMessage } from "formik";

interface Props {
  index: number;
}

export const BunkBedPrice: React.FC<Props> = ({ index }) => {
  return (
    <div className="space-y-6">
      {/* Top Bed */}
      <div>
        <p className="font-medium text-sm mb-2">Top Bed</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Daily Price</label>
            <Field
              name={`bedTypes[${index}].topBed.dailyPrice`}
              type="text"
              className="w-full border rounded-md p-2"
              placeholder="Enter daily price"
            />
            <ErrorMessage
              name={`bedTypes[${index}].topBed.dailyPrice`}
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm">Monthly Price</label>
            <Field
              name={`bedTypes[${index}].topBed.monthlyPrice`}
              type="text"
              className="w-full border rounded-md p-2"
              placeholder="Enter monthly price"
            />
            <ErrorMessage
              name={`bedTypes[${index}].topBed.monthlyPrice`}
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Bottom Bed */}
      <div>
        <p className="font-medium text-sm mb-2">Bottom Bed</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Daily Price</label>
            <Field
              name={`bedTypes[${index}].bottomBed.dailyPrice`}
              type="text"
              className="w-full border rounded-md p-2"
              placeholder="Enter daily price"
            />
            <ErrorMessage
              name={`bedTypes[${index}].bottomBed.dailyPrice`}
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm">Monthly Price</label>
            <Field
              name={`bedTypes[${index}].bottomBed.monthlyPrice`}
              type="text"
              className="w-full border rounded-md p-2"
              placeholder="Enter monthly price"
            />
            <ErrorMessage
              name={`bedTypes[${index}].bottomBed.monthlyPrice`}
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
