import * as vscode from "vscode";

export default (context: vscode.ExtensionContext) => {
  const quickPickCache = {
    getPreviousAnswersForQuestion: (question = "") => {
      return context.globalState.get(`${context.extension.id}:${question}`);
    },
    setSelectedValue: (question: string, value: any) => {
      context.globalState.update(`${context.extension.id}:${question}`, value);
    },
  };

  interface CustomQuickPickOptions extends vscode.QuickPickOptions {
    cache?: {
      limit: number;
      listTitle: string;
      cacheTitle: string;
    };
  }

  const showQuickPick = async (
    items: readonly string[] | Thenable<readonly string[]>,
    options: CustomQuickPickOptions
  ) => {
    const { cache, ...quickPickOptions } = options;
    let list = items;

    if (!quickPickOptions.title) {
      return;
    }

    // Should we cache any previous answers?
    if (cache?.limit) {
      const previousSeperator = {
        label: cache.cacheTitle,
        kind: vscode.QuickPickItemKind.Separator, // this is new
      };

      const listItem = {
        label: cache.listTitle,
        kind: vscode.QuickPickItemKind.Separator, // this is new
      };

      const previousAnswers =
        (quickPickCache.getPreviousAnswersForQuestion(quickPickOptions.title) as string[]) || [];
      const previousAnswersFiltered = previousAnswers.filter((answer) => !!answer);

      if (previousAnswers.length > 0) {
        //@ts-ignore
        list = [previousSeperator, ...previousAnswersFiltered, listItem, ...items];
        // list = items;
      } else {
        list = items;
      }

      const answer = await vscode.window.showQuickPick(list, {
        ...quickPickOptions,
      });

      // Cache the answer
      quickPickCache.setSelectedValue(quickPickOptions.title, [
        answer,
        ...previousAnswers.splice(0, cache.limit - 1),
      ]);

      return answer;
    } else {
      const answer = await vscode.window.showQuickPick(list, {
        ...quickPickOptions,
      });
      return answer;
    }
  };

  return showQuickPick;
};
