export function ScoreTableSkeleton() {
  return (
    <div className="mt-6 flow-root max-w-full">
      <div className="inline-block w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* モバイル用テーブル */}
          <div className="overflow-x-auto md:block portrait:block landscape:hidden">
            <table className="min-w-full animate-pulse">
              <thead className="rounded-lg text-left text-xs font-normal">
                <tr>
                  <th scope="col" className="px-1 py-3">
                    <div className="h-4 w-10 rounded bg-gray-200"></div>
                  </th>
                  <th scope="col" className="px-1 py-3 sm:pl-6">
                    <div className="h-4 w-20 rounded bg-gray-200"></div>
                  </th>
                  <th scope="col" className="px-1 py-3">
                    <div className="h-4 w-12 rounded bg-gray-200"></div>
                  </th>
                  <th scope="col" className="px-1 py-3">
                    <div className="h-4 w-12 rounded bg-gray-200"></div>
                  </th>
                  <th scope="col" className="px-1 py-3">
                    <div className="h-4 w-8 rounded bg-gray-200"></div>
                  </th>
                  <th scope="col" className="px-1 py-3">
                    <div className="h-4 w-8 rounded bg-gray-200"></div>
                  </th>
                  <th scope="col" className="px-1 py-3">
                    <div className="h-4 w-8 rounded bg-gray-200"></div>
                  </th>
                  <th scope="col" className="px-1 py-3">
                    <div className="h-4 w-8 rounded bg-gray-200"></div>
                  </th>
                  <th scope="col" className="px-1 py-3">
                    <div className="h-4 w-16 rounded bg-gray-200"></div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {[...Array(5)].map((_, i) => (
                  <tr
                    key={i}
                    className="w-full border-b py-3 text-xs last-of-type:border-none"
                  >
                    <td className="whitespace-nowrap px-1 py-3">
                      <div className="h-5 w-10 rounded bg-gray-200"></div>
                    </td>
                    <td className="whitespace-nowrap px-1 py-3">
                      <div className="h-5 w-20 rounded bg-gray-200"></div>
                    </td>
                    <td className="whitespace-nowrap px-1 py-3">
                      <div className="h-5 w-12 rounded bg-gray-200"></div>
                    </td>
                    <td className="whitespace-nowrap px-1 py-3">
                      <div className="h-5 w-12 rounded bg-gray-200"></div>
                    </td>
                    <td className="whitespace-nowrap px-1 py-3">
                      <div className="h-5 w-8 rounded bg-gray-200"></div>
                    </td>
                    <td className="whitespace-nowrap px-1 py-3">
                      <div className="h-5 w-8 rounded bg-gray-200"></div>
                    </td>
                    <td className="whitespace-nowrap px-1 py-3">
                      <div className="h-5 w-8 rounded bg-gray-200"></div>
                    </td>
                    <td className="whitespace-nowrap px-1 py-3">
                      <div className="h-5 w-8 rounded bg-gray-200"></div>
                    </td>
                    <td className="whitespace-nowrap px-1 py-3">
                      <div className="h-5 w-16 rounded bg-gray-200"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* デスクトップ用テーブル */}
          <div className="hidden overflow-x-auto md:block portrait:hidden landscape:block">
            <table className="min-w-full animate-pulse text-gray-900">
              <thead className="rounded-lg bg-gray-100 text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-3 py-5">
                    <div className="h-5 w-12 rounded bg-gray-200"></div>
                  </th>
                  <th scope="col" className="px-4 py-5 sm:pl-6">
                    <div className="h-5 w-24 rounded bg-gray-200"></div>
                  </th>
                  <th scope="col" className="px-3 py-5">
                    <div className="h-5 w-16 rounded bg-gray-200"></div>
                  </th>
                  <th scope="col" className="px-3 py-5">
                    <div className="h-5 w-16 rounded bg-gray-200"></div>
                  </th>
                  <th scope="col" className="px-3 py-5">
                    <div className="h-5 w-16 rounded bg-gray-200"></div>
                  </th>
                  <th scope="col" className="px-3 py-5">
                    <div className="h-5 w-20 rounded bg-gray-200"></div>
                  </th>
                  <th scope="col" className="px-3 py-5">
                    <div className="h-5 w-10 rounded bg-gray-200"></div>
                  </th>
                  <th scope="col" className="px-3 py-5">
                    <div className="h-5 w-10 rounded bg-gray-200"></div>
                  </th>
                  <th scope="col" className="px-3 py-5">
                    <div className="h-5 w-10 rounded bg-gray-200"></div>
                  </th>
                  <th scope="col" className="px-3 py-5">
                    <div className="h-5 w-10 rounded bg-gray-200"></div>
                  </th>
                  <th scope="col" className="px-3 py-5">
                    <div className="h-5 w-16 rounded bg-gray-200"></div>
                  </th>
                  <th scope="col" className="px-3 py-5">
                    <div className="h-5 w-16 rounded bg-gray-200"></div>
                  </th>
                  <th scope="col" className="px-3 py-5">
                    <div className="h-5 w-20 rounded bg-gray-200"></div>
                  </th>
                  <th scope="col" className="px-3 py-5">
                    <div className="h-5 w-24 rounded bg-gray-200"></div>
                  </th>
                  <th scope="col" className="px-3 py-5">
                    <div className="h-5 w-12 rounded bg-gray-200"></div>
                  </th>
                  <th scope="col" className="px-3 py-5">
                    <div className="h-5 w-20 rounded bg-gray-200"></div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {[...Array(5)].map((_, i) => (
                  <tr
                    key={i}
                    className="w-full border-b py-3 text-sm last-of-type:border-none"
                  >
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="h-6 w-12 rounded bg-gray-200"></div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:pl-6">
                      <div className="h-6 w-24 rounded bg-gray-200"></div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="h-6 w-16 rounded bg-gray-200"></div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="h-6 w-16 rounded bg-gray-200"></div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="h-6 w-16 rounded bg-gray-200"></div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="h-6 w-20 rounded bg-gray-200"></div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="h-6 w-10 rounded bg-gray-200"></div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="h-6 w-10 rounded bg-gray-200"></div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="h-6 w-10 rounded bg-gray-200"></div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="h-6 w-10 rounded bg-gray-200"></div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="h-6 w-16 rounded bg-gray-200"></div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="h-6 w-16 rounded bg-gray-200"></div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="h-6 w-20 rounded bg-gray-200"></div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="h-6 w-24 rounded bg-gray-200"></div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="h-6 w-12 rounded bg-gray-200"></div>
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <div className="h-[38px] w-[38px] rounded bg-gray-200"></div>
                        <div className="h-[38px] w-[38px] rounded bg-gray-200"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
