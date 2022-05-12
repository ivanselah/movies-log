import { useSearchParams } from 'react-router-dom';

function Search() {
  const [searchKeyword] = useSearchParams();
  const keyword = searchKeyword.get('keyword');

  return (
    <div>
      <p>{keyword}</p>
    </div>
  );
}

export default Search;
