import Head from "next/head";

import { Button } from "@/components/Button";
import { MainLayout } from "@/components/MainLayout";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

import { useCallback } from "react";
import { useCurrentUser } from "@/lib/user";
import { useRubricLogApprover } from "@/lib/rubriclog";

import { generatePDF } from "@/lib/rubric";

import toast from "react-hot-toast";

const CreateRubricPage = () => {
  const userResponse = useCurrentUser();
  const user = userResponse.data;

  let rubric = {
    title: "English Oral Presentation",
    activity: {
      name: "Oral Presentation",
    },
    instructions:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    creator: {
      name: "Matt Robles",
    },
    criteria: [
      {
        new_name: "Org",
        criteria: {
          title: "Organization",
          c4: "This is E",
          c3: "This is G",
          c2: "This is S",
          c1: "This is NI",
        },
        weight: 20,
      },
      {
        new_name: "Speak",
        criteria: {
          title: "Speaking Skills",
          c4: "This is E",
          c3: "This is G",
          c2: "This is S",
          c1: "This is NI",
        },
        weight: 20,
      },
      {
        new_name: "Facts",
        criteria: {
          title: "Facts and Evidence",
          c4: "This is E",
          c3: "This is G",
          c2: "This is S",
          c1: "This is NI",
        },
        weight: 10,
      },
      {
        new_name: "Conf",
        criteria: {
          title: "Confidence",
          c4: "This is E",
          c3: "This is G",
          c2: "This is S",
          c1: "This is NI",
        },
        weight: 30,
      },
      {
        new_name: "Loud",
        criteria: {
          title: "Loudness",
          c4: "This is E",
          c3: "This is G",
          c2: "This is S",
          c1: "This is NI",
        },
        weight: 20,
      },
    ],
    category_names: ["1", "2", "3", "4"],
    _id: '627f20668923d647433323b1',
    downloads: 5,
    views: 10,
    timeAgoText: "2 hours ago",
  };

  const rubricLogResponse = useRubricLogApprover(rubric._id);
  const data = rubricLogResponse.data;

  if (!data) {
    return (
      <>
        <Head>
          <title>Sample Rubric</title>
        </Head>
        {/* <Button onClick={onClick}>Download</Button> */}
      </>
    );
  }

  if (data?.rubricLog === null) {
    toast.error("Rubric is not yet approved.");
  }

  const onClick = async (e) => {
    e.preventDefault();
    generatePDF(rubric, user.user, data?.rubricLog?.approver);
  };

  return (
    <>
      <Head>
        <title>Sample Rubric</title>
      </Head>
      <Button onClick={onClick}>Download</Button>
    </>
  );
};

export default CreateRubricPage;

CreateRubricPage.getLayout = function getLayout(page) {
  return (
    <ThemeProvider>
      <MainLayout
        title={`Create Rubric`}
        description={`This page is where teachers can generate the rubric using approved criteria. First, select the activity of the rubric and then input the title. Next, select the approved criteria from the dropdown to construct the rubric. After, hit 'Create' to download the rubric in PDF file format.`}
      >
        {page}
        <Toaster />
      </MainLayout>
    </ThemeProvider>
  );
};
