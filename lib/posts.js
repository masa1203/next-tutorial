// 投稿記事のデータを取得する
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

// postsのディレクトリを取得
const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
  // /posts以下のファイル名を取得
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // .mdを文字列から削除
    const id = fileName.replace(/\.md$/, "");

    // markdownの文字列を読み込み
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // メタデータセクションをgray-matterでパース
    const matterResult = matter(fileContents);

    // ファイル名、メタデータを辞書形式にする
    return {
      id,
      ...matterResult.data,
    };
  });

  // 日付順にソートする
  return allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  // [
  //     {
  //         params: {
  //             id: "ssg-ssr"
  //         }
  //     },
  //     {
  //         params: {
  //             id: "ssg-ssr"
  //         }
  //     },
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf-8");

  const matterResult = matter(fileContents);

  // remarkでmarkdownをhtmlに変換する
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
