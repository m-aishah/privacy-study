import { PersonRaisedArmsIcon } from "./icons";

export function StandUpAvatar() {
  return (
    <div className="inline-block animate-stand-up-wiggle select-none text-kids-yellow" aria-hidden>
      <PersonRaisedArmsIcon className="w-24 h-24" />
    </div>
  );
}
