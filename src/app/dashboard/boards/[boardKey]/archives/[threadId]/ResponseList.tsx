import { ArchivedRes } from "@/gql/graphql";
import { DbRes } from "@/interfaces";
import { Dropdown } from "flowbite-react";

interface Props {
  responses: ArchivedRes[];
}

const ResponseList = ({ responses }: Props) => {
  return responses.map((response, idx) => (
    <div
      key={`${response.date}-${response.ipAddr}`}
      className="bg-gray-200 p-4 rounded-lg mb-4"
    >
      <div className="flex items-center mb-2 border-b">
        {/* <input
            type="checkbox"
            className="mr-2"
            id={`${response.id}`}
            onClick={() => {
              if (selectedResponses.includes(response)) {
                setSelectedResponses(
                  selectedResponses.filter((res) => res !== response)
                );
              } else {
                setSelectedResponses([...selectedResponses, response]);
              }
            }}
          /> */}
        <span className="font-bold mr-2">{idx + 1}</span>
        <span className="mr-2">{response.name}</span>
        <span className="text-gray-500 mr-2">{response.mail}</span>
        <span className="text-gray-500 mr-2">{response.date}</span>
        <span className="text-gray-500 flex-grow">ID:{response.authorId}</span>
        <div>
          <Dropdown
            arrowIcon={false}
            label={
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 3"
              >
                <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
              </svg>
            }
            inline
          >
            <Dropdown.Item
              onClick={() => {
                // onClickAbon(response.id);
              }}
            >
              Delete Response (Abon)
            </Dropdown.Item>
            <Dropdown.Item
              disabled={response.authedToken == null}
              onClick={() => {
                // onClickDeleteAuthedToken(response.authed_token!!);
              }}
            >
              Delete authed token
            </Dropdown.Item>
            <Dropdown.Item
              disabled={response.authedToken == null}
              onClick={() => {
                // onClickDeleteAuthedTokensAssociatedWithIp(
                //   response.authed_token!!
                // );
              }}
            >
              Delete authed token associated with writing origin ip of authed
              token
            </Dropdown.Item>
            <Dropdown.Item disabled>Edit response</Dropdown.Item>
          </Dropdown>
        </div>
      </div>
      <div
        className="whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: response.body }}
      />
      <div className="text-gray-500 text-sm mt-2">
        <p>IP: {response.ipAddr}</p>
        <p>Authed Token: {response.authedToken}</p>
      </div>
    </div>
  ));
};

export default ResponseList;