$repoPath = "C:\Users\user\.claude"
Set-Location $repoPath

git add -A

$status = git status --porcelain
if ($status) {
    $date = Get-Date -Format "yyyy-MM-dd HH:mm"
    git commit -m "auto: $date 자동 커밋"
    git push origin main
} else {
    Write-Output "변경사항 없음 - 커밋 생략"
}
