"use client";

import { gql } from "@/gql";
import { useSuspenseQuery } from "@apollo/client";
import { Dropdown, Table } from "flowbite-react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import React from "react";

const GET_NGWORDS = gql(`query GetNgWords {
  ngWords {
    id
    name
    value
    restrictionType
  }
}`);

const NgWords = () => {
  const { data: ngWords } = useSuspenseQuery(GET_NGWORDS);

  return (
    <Table>
      <Table.Head>
        <Table.HeadCell>Id</Table.HeadCell>
        <Table.HeadCell>Name</Table.HeadCell>
        <Table.HeadCell>Value</Table.HeadCell>
        <Table.HeadCell>Restriction Type</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {ngWords?.ngWords?.map((ngWord) => (
          <Table.Row key={ngWord.id}>
            <Table.Cell>{ngWord.id}</Table.Cell>
            <Table.Cell>{ngWord.name}</Table.Cell>
            <Table.Cell>{ngWord.value}</Table.Cell>
            <Table.Cell>
              <div>{ngWord.restrictionType}</div>
              <div className="text-right">
                <Dropdown label={<BiDotsHorizontalRounded />}>
                  <Dropdown.Item>Edit</Dropdown.Item>
                  <Dropdown.Item className="text-red-500">Delete</Dropdown.Item>
                </Dropdown>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default NgWords;
