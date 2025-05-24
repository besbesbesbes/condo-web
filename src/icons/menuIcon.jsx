export function TransIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8 6l13 .001m-13 6h13m-13 6h13M3.5 6h.01m-.01 6h.01m-.01 6h.01M4 6a.5.5 0 11-1 0 .5.5 0 011 0zm0 6a.5.5 0 11-1 0 .5.5 0 011 0zm0 6a.5.5 0 11-1 0 .5.5 0 011 0z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function NewIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8 12h8m-4-4v8m9-4a9 9 0 11-18 0 9 9 0 0118 0z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ReportIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3 3h2m16 0h-2m-7 15l-5 3m5-3l5 3m-5-3v3m0-3v-3m7-12v8.8c0 1.12 0 1.68-.218 2.108a2 2 0 01-.874.874C17.48 15 16.92 15 15.8 15H12m7-12H5m0 0v8.8c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C6.52 15 7.08 15 8.2 15H12m-4-5l3-3 2 3 3-3"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function SettingIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M19.5 12a2.5 2.5 0 010-5m0 5a2.5 2.5 0 000-5m0 5v9m0-14V3M12 19a2.5 2.5 0 010-5m0 5a2.5 2.5 0 000-5m0 5v2m0-7V3m-7.5 7a2.5 2.5 0 010-5m0 5a2.5 2.5 0 000-5m0 5v11m0-16V3"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function EditIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <path
          d="M17.923 3.528a1.803 1.803 0 112.549 2.55l-8.073 8.072L9 15l.85-3.4 8.073-8.072zM16 6l2 2"
          strokeLinejoin="round"
        />
        <path d="M12.5 3H12a9 9 0 109 9v-.5" />
      </g>
    </svg>
  );
}

export function SearchIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15.796 15.811L21 21m-3-10.5a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChatIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M19.4 18a5.5 5.5 0 10-4.9 3H21s-1-1-1.586-2.97M18.85 12a7.5 7.5 0 10-14.423 1C5.5 16.012 3 18 3 18h6.5"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AddPhoto(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 4H8.8c-1.68 0-2.52 0-3.162.327a3 3 0 00-1.311 1.311C4 6.28 4 7.12 4 8.8v6.4c0 1.68 0 2.52.327 3.162a3 3 0 001.311 1.311C6.28 20 7.12 20 8.8 20h6.4c1.68 0 2.52 0 3.162-.327a3 3 0 001.311-1.311C20 17.72 20 16.88 20 15.2V11" />
        <path d="M4 16l4.293-4.293a1 1 0 011.414 0L13 15m0 0l2.793-2.793a1 1 0 011.414 0L20 15m-7 0l2.25 2.25M18.5 3v2.5m0 2.5V5.5m0 0H16m2.5 0H21" />
      </g>
    </svg>
  );
}

export const icons = {
  TransIcon,
  NewIcon,
  ReportIcon,
  SettingIcon,
  EditIcon,
  SearchIcon,
  ChatIcon,
  AddPhoto,
};
