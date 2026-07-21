$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("c:\Users\alber\Downloads\APRIL 2026 - STANDARD AND NCCM SCRIPT.docx")
$doc.Content.Text | Out-File -FilePath "c:\Users\alber\OneDrive\Desktop\PATCHBOARD\script_raw.txt" -Encoding utf8
$doc.Close()
$word.Quit()
