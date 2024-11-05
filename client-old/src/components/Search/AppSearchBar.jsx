import { FormInput } from '../FormInput/FormInput';

function AppSearchBar() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex min-w-[519px] flex-row rounded-4xl border-[1.4px] border-solid border-neutral-1000 bg-white shadow-drop">
        <FormInput
          type="text"
          placeholder="Buscar..."
          className="mr-2 max-w-[450px] border-none text-base shadow-none"
        />
        <button className="cursor-pointer">
          <img
            target="_blank"
            src="/images/searchBar.png"
            className="flex h-10 w-auto justify-center rounded-full bg-white p-2"
          />
        </button>
      </div>
    </div>
  );
}

export default AppSearchBar;
