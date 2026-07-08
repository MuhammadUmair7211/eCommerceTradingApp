const PageHeader = ({ heading, subheading }) => {
  return (
    <div className="bg-slate-900 border border-slate-700 text-slate-300 p-2">
      <div className="text-center">
        <h1 className="md:text-2xl md:font-bold">{heading}</h1>

        <p className="text-gray-500 mt-2">{subheading} </p>
      </div>
    </div>
  );
};

export default PageHeader;
