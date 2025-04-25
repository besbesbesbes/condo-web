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
export const icons = {
  TransIcon,
  NewIcon,
  ReportIcon,
  SettingIcon,
  EditIcon,
};
