import SettingsForm from "components/SettingsForm";

export default function Dashboard() {
  return (
    <>
      <div className="bg-black pt-14 pb-28 px-3 md:px-8 h-auto">
        <div className="container mx-auto max-w-full"></div>
      </div>

      <div className="px-3 md:px-8 h-auto -mt-24">
        <div className="container mx-auto max-w-full">
          <div className="flex justify-center items-center">
            <SettingsForm />
          </div>
        </div>
      </div>
    </>
  );
}
