import Link from "next/link";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SearchButton() {
  return (
    <Link href="/Search">
      <FontAwesomeIcon icon={faMagnifyingGlass} className="h-5 w-5" />
      <span>Find a Charity near you!</span>
    </Link>
  );
}
